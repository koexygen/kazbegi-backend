class APIFeatures {
  constructor(data, queryString) {
    this.data = data;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };

    //ფილტრაცია
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach(el => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj).replace(
      /\b(gte|gt|lte|lt)\b/g,
      match => `$${match}`
    );

    this.data = this.data.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    //სორტი
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.data = this.data.sort(sortBy);
    } else {
      this.data.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    //ლიმიტი
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.data = this.data.select(fields);
    } else {
      this.data = this.data.select("-__v");
    }
    return this;
  }

  pagination() {
    //პაგინაცია
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.data = this.data.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
