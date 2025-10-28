import Image from 'next/image';
import ClothModal from '@/components/chat/modal/ClothModal';

interface ProductGalleryProps {
  products: Product[];
}

export default function ProductGallery({ products }: ProductGalleryProps) {
  if (products.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex gap-2 overflow-x-auto">
        {products.map((product, key) => (
          <ClothModal key={key} product={product}>
            <Image width={128} height={128} src={product.product_url} alt={product.product_id} />
          </ClothModal>
        ))}
      </div>
    </div>
  );
}
