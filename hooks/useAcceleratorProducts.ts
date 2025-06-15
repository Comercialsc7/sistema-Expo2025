import { useMemo } from 'react';
import { useProducts, Product } from './useProducts';

export const useAcceleratorProducts = () => {
  const { products, loading, error } = useProducts();
  
  const acceleratorProducts = useMemo(() => {
    console.log('DEBUG: Filtrando produtos aceleradores...');
    console.log('DEBUG: Total de produtos antes do filtro:', products.length);
    
    const filtered = products.filter(product => {
      console.log(`DEBUG: Produto ${product.name}, is_accelerator: ${product.is_accelerator} (tipo: ${typeof product.is_accelerator})`);
      return Boolean(product.is_accelerator);
    });
    
    console.log('DEBUG: Total de produtos aceleradores encontrados:', filtered.length);
    return filtered;
  }, [products]);

  return {
    acceleratorProducts,
    loading,
    error
  };
}; 