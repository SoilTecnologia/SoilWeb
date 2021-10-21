import React, { ReactChildren } from 'react'

export default function Header({children}: {children: JSX.Element}) {
	return (
      <div className="bg-primary font-serif font-semibold text-5xl text-white h-36 flex items-center justify-center mb-8">
				{children}
      </div>
	)
}
