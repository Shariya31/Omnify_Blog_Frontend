import React, { Suspense, lazy } from 'react'
import Header from './components/Header'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
const PostBlog =  lazy(() => import('./pages/PostBlog'))
const BlogDetails = lazy(() => import('./pages/BlogDetails'))
const MyBlogs = lazy(()=>import('./pages/MyBlogs'))
const Signup = lazy(() => import('./pages/Signup')) 
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login')) 
const App = () => {
  return (
    <BrowserRouter>
    <Suspense fallback={<h1>Loading...</h1>}>

      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/blogs' element={<MyBlogs/>}/>
        <Route path='/blog/:id' element={<BlogDetails/>}/>
        <Route path='/post' element={<PostBlog/>}/>
      </Routes>
    </Suspense>
    </BrowserRouter>
  )
}

export default App