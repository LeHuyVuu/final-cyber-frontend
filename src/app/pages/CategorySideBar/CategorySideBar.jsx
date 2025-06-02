import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CategorySideBar.css';
import Data from './Menu.json';

export default function CategorySideBar() {

    return (
        <div className='categorysidebar-container'>
            <div className='categorysidebar-content'>
                <div className='title'>{Data.menu_block.title}</div>
                {Data.menu_block.items.map((item, index) => (
                    <Link
                        key={index}
                        to={`${item.link}`}
                    >
                        <div className='option'>
                            <img src={item.icon_url} alt={item.text} />
                            <div className='option-name'>{item.text}</div>
                        </div>
                    </Link>
                ))}
            </div>
            <div className='categorysidebar-content'>
                <div className='title'>{Data.highlight_block.title}</div>
                {Data.highlight_block.items.map((item, index) => (
                    <Link
                        key={index}
                        to={`${item.link}`}
                    >
                        <div className='option'>
                            <img src={item.icon_url} alt={item.text} />
                            <div className='option-name'>{item.text}</div>
                        </div>
                    </Link>
                ))}
            </div>
            <div className='categorysidebar-content'>
                <Link to={'/'}>
                    <div className='option'>
                        <img src='https://salt.tikicdn.com/cache/100x100/ts/upload/08/2f/14/fd9d34a8f9c4a76902649d04ccd9bbc5.png.webp' alt='Bán hàng cùng Tiki' />
                        <div className='option-name'>Bán hàng cùng Tiki</div>
                    </div>
                </Link>
            </div>
        </div>
    )
}
