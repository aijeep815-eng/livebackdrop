import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
export default function Pricing(){
  return (<div className="wrap"><Nav/><main className="container narrow">
    <h1>Pricing</h1>
    <ul>
      <li><b>Free</b> — basic backgrounds, watermark, limited resolution</li>
      <li><b>Pro</b> — HD download, custom styles, $9.99/mo</li>
      <li><b>Business</b> — team usage, API access (contact us)</li>
    </ul>
  </main><Footer/></div>)
}
