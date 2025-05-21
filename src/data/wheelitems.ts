export interface WheelItem {
  id: number;
  type: 'product' | 'discount';
  name: string;
  imageUrl?: string;
  discountPercent?: number;
  backgroundColor: string;
}

export const wheelItems: WheelItem[] = [
  // Products (rare items)
  {
    id: 1,
    type: 'product',
    name: 'MT Town Sticker',
    imageUrl: 'https://cdn.prod.website-files.com/67f589d434b0a8c58ea74666/67f58ca0f5167a12fb864573_Asset%201.png',
    backgroundColor: '#FFFFFF'
  },
  {
    id: 2,
    type: 'product',
    name: 'MT 001Y Shirt',
    imageUrl: 'https://cdn.prod.website-files.com/67f589d434b0a8c58ea74666/67f58af0112897e4460caa66_SS24-Tee2.png',
    backgroundColor: '#fad475'
  },
  
  // Discounts (increasing rarity)
  // 10% Off (5 slices)
  {
    id: 3,
    type: 'discount',
    name: '10%',
    discountPercent: 10,
    backgroundColor: '#C0C0C0'
  },
  {
    id: 4,
    type: 'discount',
    name: '10%',
    discountPercent: 10,
    backgroundColor: '#C0C0C0'
  },
  {
    id: 5,
    type: 'discount',
    name: '10%',
    discountPercent: 10,
    backgroundColor: '#C0C0C0'
  },
  {
    id: 6,
    type: 'discount',
    name: '10%',
    discountPercent: 10,
    backgroundColor: '#C0C0C0'
  },
  {
    id: 7,
    type: 'discount',
    name: '10%',
    discountPercent: 10,
    backgroundColor: '#C0C0C0'
  },
  
  // 20% Off (4 slices)
  {
    id: 8,
    type: 'discount',
    name: '20%',
    discountPercent: 20,
    backgroundColor: '#C0C0C0'
  },
  {
    id: 9,
    type: 'discount',
    name: '20%',
    discountPercent: 20,
    backgroundColor: '#C0C0C0'
  },
  {
    id: 10,
    type: 'discount',
    name: '20%',
    discountPercent: 20,
    backgroundColor: '#C0C0C0'
  },
  {
    id: 11,
    type: 'discount',
    name: '20%',
    discountPercent: 20,
    backgroundColor: '#C0C0C0'
  },
  
  // 30% Off (3 slices)
  {
    id: 12,
    type: 'discount',
    name: '30%',
    discountPercent: 30,
    backgroundColor: '#C0C0C0'
  },
  {
    id: 13,
    type: 'discount',
    name: '30%',
    discountPercent: 30,
    backgroundColor: '#C0C0C0'
  },
  {
    id: 14,
    type: 'discount',
    name: '30%',
    discountPercent: 30,
    backgroundColor: '#C0C0C0'
  },
  
  // 40% Off (2 slices)
  {
    id: 15,
    type: 'discount',
    name: '40%',
    discountPercent: 40,
    backgroundColor: '#d3e4e6'
  },
  {
    id: 16,
    type: 'discount',
    name: '41%',
    discountPercent: 41,
    backgroundColor: '#94d1ff'
  },
  
  // 50% Off (1 slice)
  {
    id: 17,
    type: 'discount',
    name: '50%',
    discountPercent: 50,
    backgroundColor: '#ffcd8f'
  }
]; 