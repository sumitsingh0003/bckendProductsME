const getMissingError = (item) => {
    return `${item} is Missing`;
}

exports.updateProduct = (req, res, next) => {
    const {cat_id, brand_id, title, model, price, salePrice} = req.body;
    const requiredKeys = ['cat_id', 'brand_id', 'title', 'model', 'price', 'salePrice', 'id'];
    const optionalKeys = ['mainImg', 'imageData', 'remove_gallery'];
    const allKeys = Object.keys(req.body);

    // console.log('requiredKeys', requiredKeys);
    // console.log('optionalKeys', optionalKeys);
    // console.log('allKeys', allKeys);

    const unknownKeys = allKeys.filter(item=>(!requiredKeys.includes(item) && !optionalKeys.includes(item)));
    if(unknownKeys.length>0){
        return res.status(400).json({status: 'failure', message: `Unknown key ${unknownKeys[0]} exits`});
    }

    if(!cat_id){
        return res.status(400).json({status: 'failure', message: getMissingError('cat_id')});
    }

    if(!brand_id){
        return res.status(400).json({status: 'failure', message: getMissingError('brand_id')});
    }
    if(!title){
        return res.status(400).json({status: 'failure', message: getMissingError('title')});
    }
    if(!model){
        return res.status(400).json({status: 'failure', message: getMissingError('model')});
    }
    if(!price){
        return res.status(400).json({status: 'failure', message: getMissingError('price')});
    }
    if(!salePrice){
        return res.status(400).json({status: 'failure', message: getMissingError('salePrice')});
    }
    next();
}