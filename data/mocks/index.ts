export interface Client {
  id: string;
  name: string;
  code: string;
  cnpj: string;
  address: string;
  fantasyName?: string;
  legalName?: string;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  price: number;
  boxSize: number;
  discount: number;
  isAccelerator: boolean;
  image: string;
  quantity?: number;
}

export interface Brand {
  id: string;
  name: string;
  code: string;
  image: string;
}

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Supermercado Silva',
    code: '001',
    cnpj: '12.345.678/0001-90',
    address: 'Rua das Flores, 123',
    fantasyName: 'Supermercado Silva',
    legalName: 'Silva & Cia Ltda'
  },
  {
    id: '2',
    name: 'Mercado Santos',
    code: '002',
    cnpj: '98.765.432/0001-21',
    address: 'Av. Principal, 456',
    fantasyName: 'Mercado Santos',
    legalName: 'Comercial Santos Ltda'
  },
  {
    id: '3',
    name: 'Minimercado Oliveira',
    code: '003',
    cnpj: '45.678.901/0001-34',
    address: 'Rua das Palmeiras, 789',
    fantasyName: 'Minimercado Oliveira',
    legalName: 'Oliveira Comércio Eireli'
  }
];

export const mockProducts: Product[] = [
  {
    id: '64526',
    name: 'Slice Original 90g',
    code: 'SLI001',
    price: 89.90,
    boxSize: 28,
    discount: 5,
    isAccelerator: true,
    image: 'https://slicebrasil.com.br/wp-content/uploads/2024/12/logo.svg'
  },
  {
    id: '64527',
    name: 'Slice Maçã Verde 90g',
    code: 'SLI002',
    price: 89.90,
    boxSize: 28,
    discount: 5,
    isAccelerator: true,
    image: 'https://slicebrasil.com.br/wp-content/uploads/2024/12/logo.svg'
  },
  {
    id: '64528',
    name: 'Slice Laranja 90g',
    code: 'SLI003',
    price: 89.90,
    boxSize: 28,
    discount: 10,
    isAccelerator: true,
    image: 'https://slicebrasil.com.br/wp-content/uploads/2024/12/logo.svg'
  }
];

export const mockBrands: Brand[] = [
  { 
    id: '1', 
    name: 'Slice', 
    code: 'SLI',
    image: 'https://slicebrasil.com.br/wp-content/uploads/2024/12/logo.svg' 
  },
  { 
    id: '2', 
    name: 'Nestlé', 
    code: 'NES',
    image: 'https://assets.ype.ind.br/assets/logo_ype_3d.png' 
  },
  { 
    id: '3', 
    name: 'Bauducco', 
    code: 'BAU',
    image: 'https://www.lojabauducco.com.br/arquivos/logo-bauducco.png?v=638322222120300000' 
  },
  { 
    id: '4', 
    name: 'Heinz', 
    code: 'HEI',
    image: 'https://kreafolk.com/cdn/shop/articles/heinz-logo-design-history-and-evolution-kreafolk_51be050e-1ba4-4aad-a0d4-9f7c30b6787b.jpg?v=1717725012&width=2048' 
  }
]; 