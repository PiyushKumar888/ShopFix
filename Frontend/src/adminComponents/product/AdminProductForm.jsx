
import { useFieldArray, useForm } from "react-hook-form";
import {toast} from "react-hot-toast";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {AddCategoryModal} from "./AddCategoryModal.jsx";
import {Spinner} from "../../components/loaders/Spinner.jsx";
import {setProduct} from "../../features/products/productsSlice.js";
import {useDispatch} from "react-redux";
import api from "../../config/api.js";



const AdminProductForm = () => {
    const {productId} = useParams();
    const isEditMode = Boolean(productId);
    const [addloading,setaddLoading] = useState(false);
    const [editloading,setEditloading] = useState(false);
    const dispatch = useDispatch();
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [categoryList, setCategoryList] = useState([]);
    const [selectedParent ,setSelectedParent] = useState("");
    const fetchcategory =async () =>{
        try{
            const response = await api
                .get(`/category`)


            setCategoryList(response.data.data);

        }catch(err){
            console.log(err);

        }
    }
    useEffect(() => {
        fetchcategory();
    }, [productId]);
    const {
        register,
        control,
        handleSubmit,
        reset,
    } = useForm();


    const {
        fields,
        append,
        remove
    } = useFieldArray({
        control,
        name: "specifications"
    });


    const {
        fields: variantFields,
        append: appendVariant,
        remove: removeVariant
    } = useFieldArray({
        control,
        name: "variants"
    });



    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get(
                    `/product/${productId}`
                );

                const productData = response.data.data;

                setSelectedParent(productData.category?.parent?._id);

                const specArray = Object.entries(
                    productData.specification || {}
                ).map(([key, value]) => ({
                    key,
                    value,
                }));

                reset({
                    name: productData.name,
                    description: productData.description,
                    categoryId: productData.category._id,
                    specifications: specArray,
                    variants: productData.variants || [],
                });
            } catch (err) {
                console.log(err);
                toast.error("Failed to load product details.");
            }
        };

        if (isEditMode) {
            fetchProducts();
        }
    }, [productId, reset, isEditMode]);


    const onSubmitforAddProduct = async (formData) =>{

        try{
            setaddLoading(true);
            const response =  await api
                .post(`/product`,formData)

            toast.success("Product Added Successfully!");
            await fetchProducts();
        }catch(err){
            console.log(err);
            toast.error("Failed to add product");
        }finally {
            setaddLoading(false);
        }

    }
    const onSubmitforEditProduct = async (formData) =>{

        try{
            setEditloading(true);
            const response =  await api
                .put(`/product/${productId}`,formData)
            toast.success("Product Edit Successfully!");
            await fetchProducts();
        }catch(err){
            console.log(err);
            toast.error("Failed to update product");
        }finally{
            setEditloading(false);
        }


    }
    const onSubmit = (data) => {
        const formData = new FormData();
        const specificationMap = {};
        const hasImages = data.variants.some(
            variant => variant.images && variant.images.length > 0
        );

        if (!hasImages) {
            toast.error("Please upload at least one product image.");
            return;
        }
        data.specifications.forEach((item) => {
            if (item.key.trim()) {
                specificationMap[item.key] = item.value;
            }
        });
        const variantTextPayload = data.variants.map((variant,index) => {
            if (variant.images && variant.images.length > 0){
                const fileList = Array.from(variant.images);

                fileList.forEach((file,index) => {
                    formData.append(`variant_images_${index}`,file)
                })
            }
            return {
                variantName: variant.variantName,
                sku: variant.sku,
                price: Number(variant.price),
                stock: Number(variant.stock)
            };
        })


        formData.append("specifications", specificationMap);
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("categoryId", data.categoryId);
        formData.append("variants", JSON.stringify(variantTextPayload));



        if (isEditMode) {
            onSubmitforEditProduct(formData);
        }else{
            onSubmitforAddProduct(formData);
        }

    };

        const fetchProducts = async () => {
            try{
                const response = await api
                    .get(`/product?page=1&limit=1000`)

                dispatch(setProduct(response.data.data))
            }catch(error){
                console.log(error)

            }
        }



    return (
        <>

        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-4xl mx-auto p-8 space-y-6"
        >


            <div>
                <label className="block mb-2 font-medium">
                    Product Name
                </label>

                <input
                    {...register("name")}
                    className="input input-bordered w-full"
                />
            </div>


            <div>
                <label className="block mb-2 font-medium">
                    Description
                </label>

                <textarea
                    {...register("description")}
                    className="textarea textarea-bordered w-full"
                />
            </div>


            <div>
                <label className="block mb-2 font-medium">
                    Category
                </label>
                <div className="space-y-6">
                    <select

                        className="select select-bordered w-full"
                        value={selectedParent}
                        onChange={(e)=>setSelectedParent(e.target.value)}
                    >
                        <option value="">
                            Select Parent
                        </option>

                        {categoryList
                            .filter((cat)=>cat?.parent === null)
                            .map((cat, index) => (
                                <option key={cat._id} value={cat?._id || cat}
                                       >{cat.name}

                                </option>
                            ))}


                    </select>
                    <select
                        {...register("categoryId")}
                        className="select select-bordered w-full"
                    >
                        <option value="">
                            Select Child Category
                        </option>

                        {categoryList
                            .filter((cat)=>cat?.parent?._id === selectedParent)
                            .map((cat, index) => (
                                <option key={cat._id} value={cat?._id || cat}>
                                    {cat?.name || cat}
                                </option>
                            ))}


                    </select>

                </div>



            </div>


            <div>
                <label className="block mb-4 font-medium">
                    Product Variants
                </label>

                <div className="space-y-3">
                    {variantFields.map((field, index) => (
                        <div key={field.id} className="flex flex-col gap-3 border border-slate-800 p-4 rounded-xl">

                            <div className="flex flex-wrap md:flex-nowrap gap-3 items-end">
                                <div className="flex-1 min-w-[120px]">
                                    <input
                                        placeholder="Variant Name"
                                        {...register(`variants.${index}.variantName`)}
                                        className="input input-bordered w-full"
                                    />
                                </div>
                                <div className="w-28">
                                    <input
                                        placeholder="SKU"
                                        {...register(`variants.${index}.sku`)}
                                        className="input input-bordered w-full"
                                    />
                                </div>
                                <div className="w-24">
                                    <input
                                        type="number"
                                        placeholder="Price"
                                        {...register(`variants.${index}.price`)}
                                        className="input input-bordered w-full"
                                        min="0"
                                    />
                                </div>
                                <div className="w-24">
                                    <input
                                        type="number"
                                        placeholder="Stock"
                                        {...register(`variants.${index}.stock`)}
                                        className="input input-bordered w-full"
                                        min="0"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeVariant(index)}
                                    className="btn btn-error"
                                >
                                    X
                                </button>
                            </div>


                            <div className="w-full">
                                <label className="block mb-1.5 text-xs text-gray-400 font-medium">
                                    Variant Images
                                </label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    {...register(`variants.${index}.images`)}
                                    className="file-input file-input-bordered file-input-sm w-full"
                                />
                            </div>

                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={() =>
                        appendVariant({
                            variantName: "",
                            sku: "",
                            price: "",
                            stock: ""
                        })
                    }
                    className="btn btn-secondary mt-4"
                >
                    + Add Variant
                </button>
            </div>


            <div>
                <label className="block mb-4 font-medium">
                    Specifications
                </label>

                <div className="space-y-3">

                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className="flex gap-3"
                        >
                            <input
                                placeholder="Key"
                                {...register(
                                    `specifications.${index}.key`
                                )}
                                className="input input-bordered flex-1"
                            />

                            <input
                                placeholder="Value"
                                {...register(
                                    `specifications.${index}.value`
                                )}
                                className="input input-bordered flex-1"
                            />

                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="btn btn-error"
                            >
                                X
                            </button>
                        </div>
                    ))}

                </div>

                <button
                    type="button"
                    onClick={() =>
                        append({
                            key: "",
                            value: ""
                        })
                    }
                    className="btn btn-primary mt-4"
                >
                    + Add Specification
                </button>
            </div>

            <button
                disabled={addloading || editloading}
                type="submit"
                className="btn btn-success w-full"
            >
                {
                    (addloading||editloading)?(
                        <Spinner  className={"w-5 h-5"}/>
                    ):(
                        "Save Product"
                    )
                }

            </button>

        </form>
            <div>
                <div className="mt-8 rounded-2xl border border-base-300 bg-base-200/40 p-5">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        <div>
                            <h3 className="text-lg font-semibold">
                                Can't find the category?
                            </h3>

                            <p className="text-sm opacity-70 mt-1">
                                Create a new child category without leaving this page.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowCategoryModal(true)}
                            className="btn btn-primary rounded-xl px-6"
                        >
                            + Add Category
                        </button>

                    </div>

                </div>

                {
                    showCategoryModal && (
                        <AddCategoryModal
                            categoryList={categoryList}
                            fetchCategory={fetchcategory}
                            closeModal={() => setShowCategoryModal(false)}
                        />
                    )
                }
            </div>
        </>

    );
};

export default AdminProductForm