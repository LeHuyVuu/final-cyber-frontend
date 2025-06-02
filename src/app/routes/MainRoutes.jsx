import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageNotFound from "../layouts/PageNotFound/PageNotFound";
import RootLayout from "../layouts/RootLayout";
import Category from "../pages/Category/Category";
import ProductDetail from "../pages/Detail/patrials/ProductDetail";
import Home from "../pages/Home/Home";

import Cart from "../pages/Cart/Cart.jsx";
import Payment from "../pages/Payment/Payment.jsx";
import SearchResult from "../layouts/Header/SearchResult.jsx";

import SignInSignUp from "../pages/SignInSignUp/SignInSignUp.jsx";


import Account from "../pages/User/Account.jsx";
import AccountInformation from "../pages/User/AccountInformation/AccountInformation.jsx";
import UpdatePhoneNumber from "../pages/User/AccountInformation/PhoneNumberAndEmail/UpdatePhoneNumber/UpdatePhoneNumber.jsx";
import UpdateEmail from "../pages/User/AccountInformation/PhoneNumberAndEmail/UpdateEmail/UpdateEmail.jsx";
import ChangePassword from "../pages/User/AccountInformation/PhoneNumberAndEmail/ChangePassword/ChangePassword.jsx";
import UpdatePIN from "../pages/User/AccountInformation/PhoneNumberAndEmail/UpdatePIN/UpdatePIN.jsx";
import DeleteAccount from "../pages/User/AccountInformation/PhoneNumberAndEmail/DeleteAccount/DeleteAccount.jsx";
import OrderManagement from "../pages/User/OrderManagement/OrderManagement.jsx";
import HelpCenter from "../pages/User/HelpCenter/HelpCenter.jsx";
import Notification from "../pages/User/Notification/Notification.jsx";
import Address from "../pages/User/Address/Address.jsx";
import CreateAddress from "../pages/User/Address/CreateAddress/CreateAddress.jsx";
import CoinManagement from "../pages/User/CoinManagement/CoinManagement.jsx";

import Dice from "../pages/User/Game/Dice/Dice.jsx";
import Minesweeper from "../pages/User/Game/Minesweeper/Minesweeper.jsx";
import WhatIsThePassword from "../pages/User/Game/WhatIsThePassword/WhatIsThePassword.jsx";

import ScrollToTop from "../hooks/ScrollToTop/useScrollToTop.jsx";


import CategorySideBar from "../pages/CategorySideBar/CategorySideBar.jsx";
import CheckoutSuccess from "../pages/Success/CheckoutSuccess.jsx";
import Step from "../pages/Payment/Step.jsx";
import AdminInventory from "../pages/Admin/AdminInventory.jsx";
import AdminLayout from "../pages/Admin/AdminLayout.jsx";

const MainRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="detail/:id" element={<ProductDetail />} />
          <Route path="detail" element={<ProductDetail />} />
          <Route path="search" element={<SearchResult />} />
          <Route path="category" element={<Category />} />

          <Route path="*" element={<PageNotFound />} />
          <Route path="category/:categoryId" element={<Category />} />

          <Route path="login" element={<SignInSignUp />} />
          <Route path="account" element={<Account />}>
            <Route path="information" element={<AccountInformation />} />
            <Route path="information/phone-number" element={<UpdatePhoneNumber />} />
            <Route path="information/email" element={<UpdateEmail />} />
            <Route path="information/password" element={<ChangePassword />} />
            <Route path="information/pin" element={<UpdatePIN />} />
            <Route path="information/delete-account" element={<DeleteAccount />} />
            <Route path="order" element={<OrderManagement />} />
            <Route path="help-center" element={<HelpCenter />} />
            <Route path="notification" element={<Notification />} />
            <Route path="address" element={<Address />} />
            <Route path="address/create/:Id" element={<CreateAddress />} />
            <Route path="coin" element={<CoinManagement />} />
          </Route>
          <Route path="dice" element={<Dice />} />
          <Route path="minesweeper" element={<Minesweeper />} />
          <Route path="whatisthepassword" element={<WhatIsThePassword />} />
          <Route path="categorysidesar" element={<CategorySideBar />} />


          <Route path='/step' element={<Step />} >
            <Route path='cart' element={<Cart />} />
            <Route path='checkout' element={<Payment />} />
            <Route path='success' element={<CheckoutSuccess />} />
          </Route>
        </Route>
        <Route path="/admin" element={<AdminLayout />} />
      </Routes>
    </BrowserRouter>
  );
};

export default MainRoutes;
