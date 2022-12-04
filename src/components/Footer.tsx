import React from 'react'

const Footer = ({sticky = false}: {sticky?: boolean}) => {
  const styles = {
    footer: {
      position: sticky ? 'fixed' : 'static',
      bottom: '0',
      left: '0',
    }
  } as const;
  return (
    <footer style={styles.footer} className="p-4 w-full bg-white border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6">
    <span className="text-sm text-gray-500 sm:text-center">ReactPictureApp</span>
    <ul className="flex flex-wrap items-center mt-3 text-sm text-gray-500 sm:mt-0">
        <li>
            <a href="#/" className="mr-4 hover:underline md:mr-6 ">Source Code</a>
        </li>
    </ul>
</footer>
  )
}

export default Footer