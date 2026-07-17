

import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {useState} from "react";
import api from "../../config/api.js";

export const AddCategoryModal = ({
                                     categoryList,
                                     fetchCategory,
                                     closeModal,
                                 }) => {

    const { register, handleSubmit, reset } = useForm();
    const [loading, setLoading] = useState(false);
    const onSubmit = async (data) => {
        try {
            setLoading(true);
            await api.post(
                `/category`,
                {
                    name: data.name,
                    parent: data.parent,
                }
            );

            toast.success("Category Created");

            reset();

            fetchCategory();

            closeModal();

        } catch (err) {

            console.log(err);

            toast.error(
                err.response?.data?.message ||
                "Failed to create category"
            );

        }finally{
            setLoading(false);
        }

    };

    return (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-base-100 rounded-2xl w-[420px] p-6 space-y-5 shadow-2xl"
            >

                <h2 className="text-2xl font-bold">
                    Add Category
                </h2>



                <div>

                    <label className="label">
                        Category Name
                    </label>

                    <input
                        {...register("name")}
                        className="input input-bordered w-full"
                        placeholder="Gaming Laptops"
                    />

                </div>


                <div>

                    <label className="label">
                        Parent Category
                    </label>

                    <select
                        {...register("parent")}
                        className="select select-bordered w-full"
                    >

                        <option value="">
                            Select Parent
                        </option>

                        {categoryList
                            .filter(cat => cat.parent === null)
                            .map(cat => (

                                <option
                                    key={cat._id}
                                    value={cat._id}
                                >
                                    {cat.name}
                                </option>

                            ))}

                    </select>

                </div>

                <div className="flex justify-end gap-3">

                    <button
                        type="button"
                        onClick={closeModal}
                        className="btn btn-ghost"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="btn btn-primary"
                    >
                        {loading?"Creating...":"Create"}
                    </button>

                </div>

            </form>

        </div>

    );

};