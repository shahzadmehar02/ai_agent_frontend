import {useEffect, useState} from "react";
import {api} from "../Api.js";

export const Products = () => {
    const [products, setProducts] = useState([])
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')

    useEffect(() => {
        getProducts()
    }, [])

    const getProducts = () => {
        api.get("/products/")
            .then((res) => (res.data))
            .then((data) => (setProducts(data)))
            .catch((err) => console.log(err))
    }

    const createProduct = (e) => {
        e.preventDefault()
        api.post("/products/", { name, price }).then((res) => {
            if (res.status === 201) {
                alert("Product created successfully")
                getProducts()
                setName('')
                setPrice('')
            } else {
                alert("Product not created")
            }
        }).catch((err) => console.log(err))
    }

    return (
        <div>This is Product Page</div>
    )
}