export default function ReviewPage({ params }: { params: { productId: string; reviewId: string } }) {
  return (
    <div>
      <h1>Review Page</h1>
      <p>Product ID: {params.productId}</p>
      <p>Review ID: {params.reviewId}</p>
    </div>
  );
}
