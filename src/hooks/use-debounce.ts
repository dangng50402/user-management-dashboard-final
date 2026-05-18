import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 400){
    const[debounceValue, setDebounceValue] = useState<T>(value)

    useEffect(() => {
        const timer = setTimeout(() => setDebounceValue(value), delay)
        return () => clearTimeout(timer)
    }, [value, delay])

    return debounceValue
}