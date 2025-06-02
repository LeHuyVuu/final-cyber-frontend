
import React from "react";

import Banner from './Partial/Banner';
import Branch from './Partial/Branch';
import FlashSale from "./Partial/FlashSale";
import Import from './Partial/Import';
import Like from './Partial/Like';
import MainCategory from "./Partial/MainCategory";
import CategoryLinks from './Partial/SmallCategory';
import TopDeal from './Partial/TopDeal';
import Trending from "./Partial/Trending";



export default function Home() {


  return (
    <div className=''>
      <div className=" mx-28" >

        <div className="mt-10">
          <Banner />
        </div>
        <div className='px-4'>
          <div className="mb-10">
            <CategoryLinks />
          </div>
        </div>
        <div className="my-10">
          <TopDeal />
        </div>
        <div className='px-4' >
          <div className="my-10 p-5 bg-blue-100 rounded-xl ">
            <FlashSale />
          </div>
        </div>
        <div>
          <div className='my-10 '>
            <div className=' flex'>
              <div className='p-2 bg-red-300 rounded-bl-full '></div>
              <h2 className="text-2xl bg-red-300 p-3 font-bold border-b-4 border-red-400  text-gray-800 text-center mb-4 rounded-tr-full rounded-br-full">
                Khám Phá Mua Sắm
              </h2>
            </div>
            <div className=" flex items-center">
              <div className=" w-1/5">
                <Branch />
              </div>
              <div className=" w-4/5">
                <MainCategory />
              </div>
            </div>
          </div>
        </div>
        <div className="my-10 ">
          <Import />
        </div>

        <div className="my-10">
          <Like />
        </div>

        <div className="my-10  ">
          <Trending />
        </div>

      </div>
    </div>
  )
}
