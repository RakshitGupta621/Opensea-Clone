
import React, { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useWeb3 } from '@3rdweb/hooks'
import { client } from '../../lib/sanityClient'
import { ThirdwebSDK } from '@3rdweb/sdk'

const style = {
    bannerImageContainer: `h-[20vh] w-screen overflow-hidden flex justify-center items-center`,
    bannerImage: `w-full object-cover`,
    infoContainer: `w-screen px-4`,
    midRow: `w-full flex justify-center text-white`,
    endRow: `w-full flex justify-end text-white`,
    profileImg: `w-40 h-40 object-cover rounded-full border-2 border-[#202225] mt-[-4rem]`,
    socialIconsContainer: `flex text-3xl mb-[-2rem]`,
    socialIconsWrapper: `w-44`,
    socialIconsContent: `flex container justify-between text-[1.4rem] border-2 rounded-lg px-2`,
    socialIcon: `my-2`,
    divider: `border-r-2`,
    title: `text-5xl font-bold mb-4`,
    createdBy: `text-lg mb-4`,
    statsContainer: `w-[44vw] flex justify-between py-4 border border-[#151b22] rounded-xl mb-4`,
    collectionStat: `w-1/4`,
    statValue: `text-3xl font-bold w-full flex items-center justify-center`,
    ethLogo: `h-6 mr-2`,
    statName: `text-lg w-full text-center mt-1`,
    description: `text-[#8a939b] text-xl w-max-1/4 flex-wrap mt-4`,
  }

const Collection = () => {
    const router = useRouter()
    // console.log('Router query is: ', router.query)
    const { provider } = useWeb3()
    const { collectionid }  = router.query
    // console.log('collection id is: ', collectionid)
    const [collection, setCollection] = useState({})
    const [nfts, setNfts] = useState([])
    const [listings, setListings] = useState([])

    const nftModule = useMemo(() => {
        if (!provider) return
    
        const sdk = new ThirdwebSDK(
          provider.getSigner(),
          'https://eth-rinkeby.alchemyapi.io/v2/og71tBSsMd8Dj4i9pOY-aquAHJQhodKv'
        )
        return sdk.getNFTModule(collectionid)
      }, [provider])

      // this useEffect runs when we get the nftModule
      useEffect(() => {
        if (!nftModule) return
        ;(async () => {
          const nfts = await nftModule.getAll()
    
          setNfts(nfts)
        })()
      }, [nftModule])

      const marketPlaceModule = useMemo(() => {
        if (!provider) return
    
        const sdk = new ThirdwebSDK(
          provider.getSigner(),
          'https://eth-rinkeby.alchemyapi.io/v2/og71tBSsMd8Dj4i9pOY-aquAHJQhodKv'
        )
        return sdk.getMarketplaceModule(
          '0x5f3C0FF1ac16cbDFcB513C06fE986C4006b7F501'
        )
      }, [provider])

      useEffect(() => {
        if (!marketPlaceModule) return
        ;(async () => {
          setListings(await marketPlaceModule.getAllListings())
        })()
      }, [marketPlaceModule])

      const fetchCollectionData = async(
            sanityClient = client
          ) => {
            const query = `*[_type == "marketItems" && contractAddress == "${collectionid}"] {
                "imageUrl" : profileImage.asset->url,
                "bannerImageUrl": bannerImage.assest->url,
                volumeTraded,
                createdBy,
                contractAddress,
                "creator": createdBy->userName,
                title, floorPrice,
                "allOwners": owners[]->,
                desciption
              }`
            
            const collectionData = await sanityClient.fetch(query)

            console.log(collectionData, '🔥')

            // the query returns 1 object inside of an array
            await setCollection(collectionData[0])
      }

      useEffect(() => {
        fetchCollectionData()
      }, [collectionid])

    return (
        <Link href="/">
            <h2>{router.query.collectionid}</h2>
        </Link>
    )
}

export default Collection


// https://eth-rinkeby.alchemyapi.io/v2/og71tBSsMd8Dj4i9pOY-aquAHJQhodKv
// OpenSea MarketPlace i.e marketPlaceModule is 
// 0x5f3C0FF1ac16cbDFcB513C06fE986C4006b7F501 

// Bored Ape Yacht Club i.e nftModule's collectionId is same as below
// contract address: 0x0D8EC4aAB55F66046Fdfd4c1377128be01F2E886

// ${collectionId}