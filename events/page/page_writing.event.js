import Category from "../../model/page/category"
const category = new Category();
export default {
    "update_category": async (category_id, type) => {
        try {
            let categoryData = await category.findById(category_id);
            if (type == "add") {
                await category.update({
                    where: {
                        id: category_id
                    },
                    set: {
                        page_count: (categoryData[0].page_count + 1)
                    }
                })
            } else {
                await category.update({
                    where: {
                        id: category_id
                    },
                    set: {
                        page_count: (categoryData[0].page_count - 1)
                    }
                })
            }
        } catch (error) {
            throw error;
        }
    }
}