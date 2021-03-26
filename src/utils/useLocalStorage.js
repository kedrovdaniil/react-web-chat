import { useEffect, useState } from "react"

const PREFIX = 'react-web-chat-'

// по ключу возвращает данные в LocalStorage, либо возвращает initialValue
export const useLocalStorage = (key, initialValue) => {

    // префикс для исключения перетирания ключа
    const prefixKey = PREFIX + key

    // ипользуем функцию в качестве начального значения
    const [data, setData] = useState(() => {

        // получаем JSON из хранилища по ключу
        const jsonData = localStorage.getItem(prefixKey)

        // если JSON пустой, то преобразуем JSON в объект
        if (jsonData != null)
            return JSON.parse(jsonData)
        // если тип переданного значения по-умолчанию = функции, то вызываем её, если нет, то возвращаем его
        if (typeof initialValue === 'function')
            return initialValue()
        else
            return initialValue
    })

    // при монтировании компонента устанавливаем в хранилище свой JSON
    useEffect(() => {
        localStorage.setItem(prefixKey, JSON.stringify(data))
    }, [prefixKey, data])

    // возвращаем данные и функцию обновления данных
    return [data, setData]
}