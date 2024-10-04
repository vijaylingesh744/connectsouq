import React, { useState } from 'react'
import location from '../../../../utils/location.json'
import AllSkill from '../../../../../all_skills'
import { useLocation } from 'react-router-dom'

const FilterColumn = ({ FilterData }) => {
  const locations = useLocation();
  const {
    setFormData,
    Formdata,
    FetchApiData,
    options,
    HandleSubmit,
  } = FilterData

  const [cityList, setCityList] = useState([]);
  const Citylist = (title) => {
    const filteredCities = [];
    var data = location.find(item => item.name == Formdata.country)
    data.states.forEach(state => {
      state.cities.forEach(city => {
        if (city.name.toLowerCase().startsWith(title.toLowerCase())) {
          filteredCities.push({ name: city.name, state: state.name });
        }
      });
    });
    setCityList(filteredCities)
  }

  // const Citylist = (title) => {
  //   const filteredCities = [];
  //   location.forEach(country => {
  //     country.states.forEach(state => {
  //       state.cities.forEach(city => {
  //         const fullName = `${city.name} ${state.name} ${country.name}`;
  //         if (fullName.toLowerCase().includes(title.toLowerCase())) {
  //           filteredCities.push({ city: city.name, state: state.name, country: country.name });
  //         }
  //       });
  //     });
  //   });
  //   setCityList(filteredCities);
  // };

  return (
    <>
      <div className='container-fluid d-flex py-0 px-0 justify-content-between'>
        <div className='d-flex align-items-center w-100 column-gap-1 mr-2'>
          <div className='filterinput'>
            <select
              name="country"
              className="form-control"
              value={Formdata.country}
              placeholder=" "
              onChange={(e) => {
                setFormData({ ...Formdata, ["country"]: e.target.value })
              }}>
              <option value="">Country</option>
              {location.map(item => (
                <option value={item.name}>{item.name}</option>
              ))}
            </select>
          </div>
          <div className='filterinput'>
            <input list="citys"
              name="city"
              className="form-control"
              placeholder='Enter location'
              disabled={Formdata.country ? false : true}
              onChange={(e) => {
                const { name, value } = e.target;
                Citylist(value)
                setFormData({ ...Formdata, ["location"]: value });
              }}
            />
            <datalist id="citys">
              {cityList.map(item => (
                <option value={item.name + " " + item.state}>{item.name + " " + item.state}</option>
              ))}
            </datalist>
          </div>
          {locations.pathname != '/bp/find_business' &&
            <div className='filterinput' style={{ display: Formdata.filter_by == "1" ? "none" : "block" }} >
              <select
                className='select-form form-control'
                onChange={(e) => {
                  var { value } = e.target;
                  setFormData({ ...Formdata, ["user_type"]: value });
                }}
              >
                <option value="-1" key="">Type</option>
                <option value="0" key="">Buyer</option>
                <option value="2" key="">Seller</option>
              </select>
            </div>
          }
          <div className='filterinput'>
            <select className={`form-control inputcontrol w-100`}
              id="exampleInputCountry"
              placeholder=" "
              onChange={(e) => {
                FetchApiData(e.target.value);
              }}
              aria-describedby="countryHelp">
              <option value="">Industry</option>
              {options && options.map((item) => (
                <option value={item._id}>{item.title}</option>
              ))}
            </select>
          </div>
        </div>
        <button className='btn btn-connect px-3 py-0' onClick={() => HandleSubmit()}>Filter</button>
      </div>
    </>

  )
}


export default FilterColumn
