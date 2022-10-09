import type { NextPage,GetServerSideProps } from 'next'
import Head from 'next/head'
import {sanityClient,urlFor} from "../sanity"
import Image from 'next/image'
import { Collection } from '../typing'
import Link from 'next/link'


interface Props{
  collections:Collection[]
}
const Home = ({collections}:Props) => {

  return (
    <div className=" mx-auto flex min-h-screen max-w-7xl flex-col py-20 px-10 2xl:px-0">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
        <title>DropDrapp NFT</title>
      </Head>
      <h1 className="mb-10 text-4xl font-extralight ">The <span className="font-extrabold underline
         decoration-pink-600/50">Hymnsbharat</span>{" "}
        NFT Market Place</h1>
        <main className="bg-slate-100 p-10 shadow-xl shadow-rose-400">
          <div className="grid space-x-3 lg:grid-cols-3 2xl:grid-cols-4 md:grid-cols-2">
            {collections.map((collection)=>{
              
            return(
                <Link href={`/nft/${collection.slug.current}`}>
             
              <div className="flex flex-cosl items-center cursor-pointer transition-all duration-200 hover:scale-105">
                <img className="h-96 w-60 rounded-2xl object-cover" src={urlFor(collection.mainImage).url()} alt=""/>
             <div className="p-5">
              <h2 className="text-3xl">{collection.title}</h2>
              <p className="text-sm text-gray-400 mt-2">{collection.description}</p>
             </div>
              </div>
              </Link>
            )})}
          </div>
        </main>
     

 
    </div>
  )
}

export default Home

export const getServerSideProps:GetServerSideProps =async () => {
  const query=`*[_type == "collection"]{
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
  const collections = await sanityClient.fetch(query);

  return {
    props:{
      collections
    }
  }
}
