import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface TextFieldProps {
    placeholder?: string;
    isPassword?: boolean;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}


function TextField({ placeholder, isPassword = false, onChange, value }: TextFieldProps) {
    const [showPassword, setShowPassword] = useState<boolean>(!isPassword);
    const [localValue, setLocalValue] = useState<string>(value ?? "");
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
                        setLocalValue(e.target.value);
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
                        {localValue.length > 0 ?
                            showPassword ?
                                <FaEyeSlash /> : <FaEye /> : <></>}
                    </button>
                )
            }
        </div>
    )
}

export default TextField