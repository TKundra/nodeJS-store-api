import asyncWrapper from '../middlewares/async';
import Products from '../model/products';

const getAllProductsStatic = asyncWrapper(async (req, res) => {
    const products = await Products.find().sort('price').select('name price');
    res.status(200).json({msg: products, length: products.length });
});
/*
    get all products
    products on the basis of numericField = price>30
    products on the basis of featured, company, name {as defined in db}
    products on the basis of asc, desc sorting
    products on the basis of particular fields (multiple) - fields = name,company
    pagination of data limit per page
*/
const getAllProducts = asyncWrapper(async (req, res) => {
    // req.query - url/?featured=true
    const {featured, company, name, sort, fields, numericFilter} = req.query;
    const queryObject = {};

    // if user enter data that is not avaiable, still get result on the basis of suitable data
    // add query data in object accordingly
    if (featured){
        queryObject.featured = featured === 'true' ? true : false;
    }
    if (company){
        queryObject.company = company;
    }
    if (name){ // with regex it will work as 'LIKE' of SQL (not working)
        queryObject.name = {$regex:name, $option: 'i'};
    }

    // console.log(queryObject); // {featured: true, company: ''}

    // url/?numericFilter=price>30
    if (numericFilter){ // filter for price and rating
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        };
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        // convert price>30 to price: $gt 30
        let filters = numericFilter.replace(regEx, (match) => `-${operatorMap[match]}-`); // price-$gt-30 and added '-' to separate fields later
        const options = ['price', 'rating'];
        filters.split(',').forEach((element) => {
            const [field, operator, value] = element.split('-'); // price $gt 30
            if (options.includes(field)){ // if options have that field
                queryObject[field] = {[operator]: Number(value)}; // update field i.e price: { '$lte': 30 }
            }
        });

    }

    // querObject - { price: { '$gt': 30 } }

    const result = Products.find(queryObject);
    if (sort){ // sort = -name (desc) & sort = name (asc)
        // for multiple data sorting
        const sortList = sort.split(',').join(' '); // -name, company -> [-name, company] -> -name company
        result.sort(sortList);
    }else {
        result.sort('createdAt');
    }

    if (fields){ // only result in selected fields
        // url/?fields=name,company
        const fieldsList = fields.split(',').join(' '); // name,company -> [name,company] -> name company
        result.select(fieldsList);
    }

    // pagination ----------------------------------------------
    // limit - limits the ouput, akip - skips number of elements
    // 23 products, limit - 7, 4 pages i.e 7-7-7-2
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page-1)*limit; // if limit-7 and 2nd page result in 7 skips to show items after 7 items from above
    result.skip(skip).limit(limit);

    const products = await result;
    res.status(200).json({ products: products, length: products.length });
});

export {getAllProducts, getAllProductsStatic};