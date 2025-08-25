import React, { useState } from 'react'

interface TextFieldProps{
    placeholder?: string;
    isPassword?: boolean;
}



function TextField({ placeholder, isPassword = false }: TextFieldProps) {
    const [showPassword, setShowPassword] = useState(!isPassword);
    return (
        <div className="border-2 my-4 w-1/4 p-2 rounded flex flex-row ">
            <input
                type={!showPassword ? "password" : "text"}
                className="w-full outline-none fill-gray-500"
                placeholder={placeholder}
                alt={placeholder}
            />
            {
                isPassword && (
                    <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="ml-2 text-gray-500 hover:text-gray-800 focus:outline-none"
                        >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                )
            }
        </div>
    )
}

export default TextField