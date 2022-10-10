const country = require("../models/countrySchema");
const csvtojson = require("csvtojson");

exports.countryDetails = async (req, res, next) => {
    try {
        let checkName = await country.findOne({ countryName: req.body.countryName });
        if (checkName) {
            res.status(400).send("country already exists");
        }
        else {
            const postcountry = new country({
                countryName: req.body.countryName,
                countryCode: req.body.countryCode,
                status: req.body.status
            })
            res.status(200).send(postcountry)
            postcountry.save()
        }
    } catch (error) {
        res.status(406).send("message: " + error.message)
    }
}

exports.updateStatus = async (req, res, next) => {
    try {
        const status = await country.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).send(status)
    } catch (error) {
        res.status(500).send(error.message)
    }
}

exports.getAllCountryDetails = async (req, res) => {
    try {
        const allCountries = await country.find().sort({ countryName: 1 })
        res.status(200).send(allCountries)
    }
    catch (err) {
        res.status(403).send(err.message)
    }
}

exports.deleteCountry = async (req, res) => {
    try {
        const deleteCountry = await country.findById(req.params.id);
        deleteCountry.remove();
        res.status(200).send("deleted succesfully")
    }
    catch {
        res.status(404).send("country not found")
    }
}

exports.findCountry = async (req, res) => {
    try {
        const contryDetails = await country.find({ $filter: { countryName: req.body.countryName } })
        res.status(200).send(contryDetails)
    } catch (error) {
        res.status(404).send("country not found");
    }
}
//search and pagination in one

exports.countrySearchAndPaginate = async (req, res) => {
    try {

        let searchField = req.query.countryName;
        let status = req.query.status;
        const { page = 1, limit = 10 } = req.query;
        var countries;
        var allCountries;

        if (searchField) {
            countries = await country.find({ countryName: { $regex: searchField, $options: '$i' } })
                .limit(limit * 1)
                .skip((page - 1) * limit);
        }
        else if (status) {
            countries = await country.find({ status })
                .limit(limit * 1)
                .skip((page - 1) * limit);
        }
        else {
            countries = await country.find()
                .limit(limit * 1)
                .skip((page - 1) * limit);
        }

        allCountries = await country.find();


        res.status(200).json({ "total": countries.length, "totalCount": allCountries.length, countries, searchField });

    } catch (error) {
        res.status(500).send(error.message)
    }
}

exports.uploadCountryFile = async (req, res) => {
    try {
        csvData = req.files.allCountries.data.toString('utf8');
        return csvtojson().fromString(csvData).then(async (json) => {
            const countries = await country.insertMany(json);
            console.log(countries);
            return res.status(201).json({ json: json })
        })
    } catch (error) {
        res.status(500).send(error.message)
    }
}


