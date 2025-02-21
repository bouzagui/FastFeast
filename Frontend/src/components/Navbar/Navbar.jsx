import React from 'react'
import { ShoppingCart } from 'lucide-react'
import { SignedIn, SignedOut,SignInButton, UserButton } from '@clerk/clerk-react'
function Navbar() {
  return (
    <div>
        <nav className="p-0 m-0  bg-amber-400 size-auto">
          <div className="ml-11 mr-11">
            <div className="flex justify-between items-center">
                <a href="#" className=" m-0 p-0 font-extrabold text-2xl">logo</a>
                <div className='grid grid-cols-3 relative top-2'>
                  <a href="#" className='relative right-11 font-bold text-[20px]'>home</a>
                  <ShoppingCart className='size-8 mr-16' />
                  <div className='relative font-bold size-12'>
                    <SignedOut>
                      <SignInButton />
                    </SignedOut>
                    <SignedIn>
                    <UserButton />
                    </SignedIn>
                  </div>
                </div>
            </div>
          </div>
        </nav>
    </div>
  )
}

export default Navbar