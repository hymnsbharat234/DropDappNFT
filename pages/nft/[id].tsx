import React,{useState,useEffect} from 'react'
import {sanityClient,urlFor} from "../../sanity"
import type { NextPage,GetServerSideProps } from 'next'
import {useAddress,useDisconnect,useContract,useNFTDrop , useMetamask} from "@thirdweb-dev/react"
import { Collection } from '../../typing'
import Link from 'next/link'
import { BigNumber } from 'ethers'
import toast,{Toaster} from "react-hot-toast"

interface Props{
  collection:Collection
}
function NFTDropPage({collection}:Props) {
  const [clamiedsuplly,setclamiedsuplly] = useState<number>(0);
  const [totalsuplly,settotalsuplly] = useState<BigNumber>();
  const [loading,setloading] = useState<boolean>(true);
  const[priceInEth,setPriceInEth] = useState<string>();
  const nftDrop = useNFTDrop(collection.address);
 

useEffect(()=>{
  if(!nftDrop) return;
  const fetchPrices=async()=>{
    const clamiedConditions = await  nftDrop.claimConditions.getAll()
    setPriceInEth(clamiedConditions?.[0].currencyMetadata.displayValue)
  }
  fetchPrices();
},[nftDrop])
  useEffect(()=>{
    if(!nftDrop) return;
    const fetchNFTDropData=async()=>{
      setloading(true)
      const claimed=await nftDrop.getAllClaimed();
      const total=await nftDrop.totalSupply();
      setclamiedsuplly(claimed.length)
      settotalsuplly(total)
      setloading(false)
    }
    fetchNFTDropData()
  },[nftDrop])  
  const minNFT=()=>{
    setloading(true)
    const notification= toast.loading("Minting...",{
      style:{
        background:"#fff",
        color:"green",
        fontWeight:"bolder",
        fontSize:"17px",
        padding:"20px"

      }
    })
   if(!nftDrop || !address) return;
   const quantity=1
   nftDrop.claimTo(address,quantity).then(async(tx)=>{
    const receipt=tx[0].receipt
    const clamiedTokenId=tx[0].id
    const claimedNFT= await tx[0].data()
    toast("YUPP ..You sucessfully implemented",{
      duration:8000,
      style:{
        background:"green",
        color:"white",
        fontWeight:"bolder",
        fontSize:"17px",
        padding:"20px"
      }
    })
    console.log(receipt,"receipt")
    console.log(clamiedTokenId,"clamiedTokenId")
    console.log(claimedNFT,"claimedNFT")


   }).catch((err) =>{ console.log(err)
    toast("whoops...Something went wrong!",{
      style:{
        background:"red",
        color:"white",
        fontWeight:"bolder",
        fontSize:"17px",
        padding:"20px"
      }
    })
  }).finally(() => {
    setloading(false)
    toast.dismiss(notification)
  });

  }
  const connectWithMetamask =useMetamask();
    
    const address=useAddress();
    
    const disconnect=useDisconnect();
  return (
    <div className="flex h-screen flex-col 
    lg:grid lg:grid-cols-10">
      <Toaster position='bottom-center'/>
      <div className="bg-gradient-to-br
       from-cyan-800 to-rose-500 lg:col-span-4">
        <div className="flex flex-col items-center
         justify-center py-2 lg:min-h-screen">
            <div className="bg-gradient-to-br rounded-xl
             from-yellow-400 to-purple-600 p-2">
            <img className="w-44 rounded-xl object-cover
             lg:h-96 lg:w-72" src={urlFor(collection.previewImage).url()} 
            alt="" />
            </div>
           
            <div className=" space-y-2 text-center p-5">
                <h1 className='text-4xl font-bold text-white'>{collection.nftCollectionName}</h1>
                <h2 className='text-xl text-gray-300'>{collection.description}</h2>
            </div>
        </div>
      </div>
      {/*Right */}
      <div className="flex flex-1 flex-col p-12 lg:col-span-6">
 
       <header className="flex items-center justify-between">
       <Link href={'/'}>
        <h1 className="w-52 cursor-pointer text-xl 
        font-extralight sm:w-80">The <span className="font-extrabold underline
         decoration-pink-600/50">Hymnsbharat</span>{" "}
        NFT Market Place</h1>
        </Link>
       <button onClick={()=>address ? disconnect() : connectWithMetamask()} className="rounded-full bg-rose-400 px-4 
       py-2 text-xs font-bold
        text-white lg:px-5 lg-py-3 lg:text-base">{address ? 'Sign Out' : 'Sign In'}</button>
       </header>
       <hr className="my-2 border"/>
       {address && <p className='text-center text-sm text-rose-400'>You'r logged In with wallet {address.substring(0,5)}...{address.substring(address.length-5)}!!</p>}
       <div className='mt-10 flex flex-1 flex-col items-center space-py-6
       lg:space-y-0 text-center lg:justify-center'>
        <img className='w-80 object-cover pb-10 lg:h-40' 
        src="https://links.papareact.com/bdy"alt=""/>
       <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">The HymnBharat Ape coding Club | NFT Drop</h1>
       {loading ? (
         <p className=' pt-2 text-xl text-green-500 animate-bounce'>Loading count....</p>
       ):(
        <p className=' pt-2 text-xl text-green-500'>{clamiedsuplly}/{totalsuplly?.toString()} NFT's channel</p>
       )
      }
      {loading && <img className='w-80 object-contain h-40' 
        src="https://miro.medium.com/max/1400/1*CsJ05WEGfunYMLGfsT2sXA.gif"alt=""/>}
      
       </div>
       <button onClick={minNFT} disabled={loading || clamiedsuplly === totalsuplly?.toNumber() || !address} className="h-16  mt-10 w-full  bg-red-600 rounded-full font-bold text-white disabled:bg-400">
        {loading ? (
          <>Loading</>
        ):clamiedsuplly === totalsuplly?.toNumber() ? (
          <>Sold out</>

        ):!address ? (
          <>Sign in to mint</>
        ):(<span className="font-bold">Mint NFT ({priceInEth}) ETH</span>) }
        
       </button>
       
      </div>
    
    </div>
  )
}

export default NFTDropPage

export const getServerSideProps:GetServerSideProps=async ({params}) =>{
  const query=`*[_type == "collection" && slug.current == $id][0]{
    _id,
    title,
    address,
    description,
    nftCollectionName,
    mainImage{
      asset
    },
    previewImage{
      asset
    },
    slug{
      current
    },
    creator->{
      _id,
      name,
      address,
      slug{
        current
      },
    },

  }`
  const collection = await sanityClient.fetch(query,{
    id:params?.id,
  });
  
if(!collection){
  return {
    notFound:true
  }
}
return {
  props:{
    collection
  }
}
}