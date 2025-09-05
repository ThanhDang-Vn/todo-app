import { Metadata } from 'next';
type Props = {
  params: {
    productId: string;
  };
};

export const generateMetadata = ({ params }: Props): Metadata => {
  return {
    title: `Product ${params.productId}`,
  };
};

export default function detailProduct({ params }: Props) {
  return (
    <div>
      <h1>Product detail {params.productId}</h1>
      <div>
        <h1>review product</h1>
      </div>
    </div>
  );
}
