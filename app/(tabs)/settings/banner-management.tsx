import { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Platform, 
  ScrollView, 
  Image,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  Pressable,
  ViewStyle,
  TextStyle
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Plus, Trash2, CreditCard as Edit2, Upload, X, GripVertical } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useBannerStore } from '../../../store/useBannerStore';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture, Directions } from 'react-native-gesture-handler';
import { Banner } from '../../../store/useBannerStore';
import InputGroup from '../../../components/shared/InputGroup';
import { optimizeImage } from '../../../lib/imageUtils';

const defaultColors = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#D4A5A5",
  "#FFB6B9", "#61C0BF", "#BBDED6", "#FAE3D9", "#FFB6B9"
];

export default function BannerManagement() {
  const { banners, addBanner, updateBanner, deleteBanner, reorderBanners } = useBannerStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const translateY = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const [formData, setFormData] = useState<{
    title: string;
    subtitle: string;
    backgroundColor: string;
    image: string;
  }>({
    title: '',
    subtitle: '',
    backgroundColor: defaultColors[0],
    image: '',
  });

  const handleAddBanner = () => {
    setEditingBanner(null);
    setFormData({
      title: '',
      subtitle: '',
      backgroundColor: defaultColors[0],
      image: '',
    });
    setIsModalVisible(true);
  };

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      backgroundColor: banner.backgroundColor,
      image: banner.image,
    });
    setIsModalVisible(true);
  };

  const handleDeleteBanner = (bannerId: number) => {
    deleteBanner(bannerId);
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      const optimizedUri = await optimizeImage(result.assets[0].uri, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.8
      });
      setFormData(prev => ({ ...prev, image: optimizedUri }));
    }
  };

  const handleSaveBanner = () => {
    if (editingBanner) {
      updateBanner(editingBanner.id, formData);
    } else {
      const newBanner: Banner = {
        id: Date.now(),
        ...formData,
        order: banners.length,
      };
      addBanner(newBanner);
    }
    setIsModalVisible(false);
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      isDragging.value = true;
    })
    .onUpdate((event) => {
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      isDragging.value = false;
      translateY.value = withSpring(0);
      if (draggingIndex !== null) {
        const newIndex = Math.max(
          0,
          Math.min(
            Math.round(translateY.value / 216 + draggingIndex),
            banners.length - 1
          )
        );
        if (newIndex !== draggingIndex) {
          runOnJS(reorderBanners)(draggingIndex, newIndex);
        }
        runOnJS(setDraggingIndex)(null);
      }
    });

  const renderBanner = (banner: Banner, index: number) => {
    const isBeingDragged = index === draggingIndex;
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        {
          translateY: isBeingDragged ? translateY.value : 0,
        },
      ],
      zIndex: isBeingDragged ? 1 : 0,
      shadowOpacity: withSpring(isBeingDragged ? 0.2 : 0),
    }));

    return (
      <Animated.View key={banner.id} style={[styles.bannerCard, animatedStyle]}>
        <GestureDetector gesture={panGesture}>
          <Pressable
            onPressIn={() => setDraggingIndex(index)}
            style={styles.dragHandle}
          >
            <GripVertical size={24} color="#666666" />
          </Pressable>
        </GestureDetector>
        <Image source={{ uri: banner.image }} style={styles.bannerImage} />
        <View style={[styles.bannerOverlay, { backgroundColor: banner.backgroundColor + '99' }]}>
          <View style={styles.bannerInfo}>
            <Text style={styles.bannerTitle}>{banner.title}</Text>
            <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
            <Text style={styles.orderText}>Ordem: {banner.order + 1}</Text>
          </View>
          <View style={styles.bannerActions}>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => handleEditBanner(banner)}
            >
              <Edit2 size={20} color="#003B71" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]} 
              onPress={() => handleDeleteBanner(banner.id)}
            >
              <Trash2 size={20} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#003B71" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Banners Promocionais</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddBanner}>
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        scrollEnabled={!isDragging.value}
      >
        {banners
          .sort((a, b) => a.order - b.order)
          .map((banner, index) => renderBanner(banner, index))}
      </ScrollView>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {editingBanner ? 'Editar Banner' : 'Novo Banner'}
                  </Text>
                  <TouchableOpacity 
                    onPress={() => setIsModalVisible(false)}
                    style={styles.closeButton}
                  >
                    <X size={24} color="#666666" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  style={styles.imageUpload} 
                  onPress={handlePickImage}
                >
                  {formData.image ? (
                    <Image 
                      source={{ uri: formData.image }} 
                      style={styles.previewImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.uploadPlaceholder}>
                      <Upload size={32} color="#003B71" />
                      <Text style={styles.uploadText}>Upload da Imagem</Text>
                    </View>
                  )}
                </TouchableOpacity>

                <View style={styles.form}>
                  <InputGroup
                    label="Título"
                    value={formData.title}
                    onChangeText={(text: string) => setFormData(prev => ({ ...prev, title: text }))}
                    placeholder="Ex: Promoção Especial"
                  />

                  <InputGroup
                    label="Subtítulo"
                    value={formData.subtitle}
                    onChangeText={(text: string) => setFormData(prev => ({ ...prev, subtitle: text }))}
                    placeholder="Ex: Ganhe 10% de desconto"
                  />

                  <View>
                    <Text style={styles.label}>Cor de Fundo</Text>
                    <View style={styles.colorPicker}>
                      {defaultColors.map((color, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.colorOption,
                            { backgroundColor: color },
                            formData.backgroundColor === color && styles.selectedColor,
                          ]}
                          onPress={() => setFormData(prev => ({ ...prev, backgroundColor: color }))}
                        />
                      ))}
                    </View>
                  </View>
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSaveBanner}>
                  <Text style={styles.saveButtonText}>Salvar Banner</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    paddingTop: Platform.OS === 'web' ? 16 : 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    color: '#003B71',
    fontFamily: 'Montserrat-Bold',
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: '#0088CC',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#0088CC',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 4px 14px rgba(0, 136, 204, 0.3)',
      }
    }),
  },
  content: {
    padding: 16,
  },
  bannerCard: {
    height: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }
    }),
  },
  dragHandle: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 10,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  bannerInfo: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Regular',
    marginBottom: 4,
  },
  orderText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Medium',
    opacity: 0.8,
  },
  bannerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FFE5E5',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  } as ViewStyle,
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  } as ViewStyle,
  modalTitle: {
    fontSize: 20,
    color: '#003B71',
    fontFamily: 'Montserrat-Bold',
  } as TextStyle,
  closeButton: {
    padding: 8,
  } as ViewStyle,
  imageUpload: {
    height: 200,
    backgroundColor: '#F8F9FA',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderStyle: 'dashed',
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    marginTop: 12,
    color: '#003B71',
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  form: {
    gap: 16,
  } as ViewStyle,
  label: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    fontFamily: 'Montserrat-Medium',
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  } as ViewStyle,
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  } as ViewStyle,
  selectedColor: {
    borderColor: '#003B71',
  } as ViewStyle,
  saveButton: {
    backgroundColor: '#0088CC',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
  },
});