export default function ProCheckoutRedirect(){
  if (typeof window !== 'undefined') window.location.href = '/api/checkout/pro';
  return <p className='p-10 text-center'>跳转到支付中...</p>;
}
