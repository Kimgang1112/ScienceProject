import React from 'react'

export default function InputBox({ label, name, placeholder, value, onChange, disabled }) {
  return (
    <div className="stdi">
      <label>
        {label}
        <input
          type="text"
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="inputbox"
          disabled={disabled}
        />
      </label>
    </div>
  )
}
