import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface TextFieldProps {
    placeholder?: string;
    isPassword?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}



function TextField({ placeholder, isPassword = false, onChange }: TextFieldProps) {
    const [showPassword, setShowPassword] = useState<boolean>(!isPassword);
    const [value, setValue] = useState<string>("")
    return (
        <div
            className="w-full my-2 p-2 rounded-lg flex items-center 
                    bg-gray-200 
                    hover:border-[1.5px] hover:border-black
                    focus-within:!border-2 focus-within:border-black"
        >
            <input
                type={!showPassword ? "password" : "text"}
                className="w-full outline-none"
                placeholder={placeholder}
                alt={placeholder}
                title={"Enter your " + placeholder?.toLowerCase() + " here"}
                onChange={
                    (e) => {
                        setValue(e.target.value);
                        onChange?.(e);
                    }
                }
            />
            {
                isPassword && (
                    <button type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="ml-2 text-gray-500 hover:text-gray-800 focus:outline-none"
                    >
                        {value.length > 0?
                        showPassword?
                            <FaEyeSlash /> : <FaEye />: <></>}
                    </button>
                )
            }
        </div>
    )
}

export default TextField