class APIFeatures{
    constructor(Person, query,queryString){
        this.query = query;
        this.queryString = queryString;
        this.length = 0;
        this.Person = Person;
    }
    filter(){
        let newQuery = {...this.queryString};
        let queryObject =  ['sort','filter','fields','limit','page'];
        queryObject = queryObject.forEach(element => {
            delete newQuery[element]
        });
        let name, place;
        if(newQuery.anyName){
            name = newQuery.anyName
            delete newQuery['anyName']
        }
        if(newQuery.anyPlace){
            place = newQuery.anyPlace
            delete newQuery['anyPlace'];
        }
        let queryStr = JSON.stringify(newQuery);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match=>`$${match}`)
        let normalFilter = JSON.parse(queryStr);
        let anyNameFilter = null;
        if(name){
            anyNameFilter = {
                $or:[
                    {firstName: {$regex: name, $options: "i"}},
                    {otherName: {$regex: name, $options: "i"}},
                    {fatherName: {$regex: name, $options: "i"}},
                    {motherName: {$regex: name, $options: "i"}},
                    {grandFatherName: {$regex: name, $options: "i"}},
                    {motherFatherName: {$regex: name, $options: "i"}},
                    {discription: {$regex: name, $options: "i"}}
                ]
            }
        }
        let anyPlaceFilter = null;
        if(place){
            anyPlaceFilter = {
                $or:[
                    {'address.region': {$regex: place, $options: "i"}},
                    {'address.zone': {$regex: place, $options: "i"}},
                    {'address.town': {$regex: place, $options: "i"}},     
                ]
            }
        }
        let filters = {
            ...anyPlaceFilter,
            ...normalFilter,
            ...anyNameFilter
        }
        this.Person.countDocuments(filters).exec().then((length)=>{
            this.length = length
        }).catch(err=>{
            console.log(err ,' 13425098765')
        })
        this.query = this.query.find(filters) 
        return this;
    }
    sort(){
        if(this.queryString.sort){
            console.log('There is sort')
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }
        else this.query = this.query.sort('-createdAt');
        return this;
    }
    paginate(){
        const page = this.queryString.page*1||1;
        const limit = this.queryString.limit*1||12;
        const skip = (page-1)*limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
    field(){
        if(this.queryString.fields){
            let fields = this.queryString.fields.split(',').join(' ');
            if(fields.indexOf('user') == -1){
                fields+= ' -user'
            } 
            this.query = this.query.select(fields);
        }
        else this.query = this.query.select(' -__v -user -photoArray -id' );
        return this 
    }
}
module.exports  = APIFeatures;
