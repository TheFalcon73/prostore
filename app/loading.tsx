import Image from "next/image";
import loader from '@/assets/loader.gif';



const LoadingPage = () => {
    return ( 
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw',
        }}>
            <Image src={loader} height={150} width={150} alt="Loading..." className="w-10 h-auto"/>
        </div>
     );
}
 
export default LoadingPage;