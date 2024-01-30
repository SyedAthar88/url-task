import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import FormData from 'form-data';
export default function Form() {
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [btnEnabledDisabled, setBtnEnabledDisabled] = useState(false);
  const BaseUrl = 'http://localhost:3001';
  const handleSubmit = (e) => {
    e.preventDefault();
    setBtnEnabledDisabled(true);
    let data = new FormData();
    data.append('user_id', userId);
    data.append('token', token);
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: BaseUrl + '/api/getData',
      headers: {},
      data: data
    };
    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setUserId('');
        setToken('');
        setBtnEnabledDisabled(false);
        Swal.fire(
          response.data.message,
          '',
          'success'
        );
      })
      .catch((error) => {
        console.log(error);
        setUserId('');
        setToken('');
        setBtnEnabledDisabled(false);
        Swal.fire(
          'An unhandled error excepion',
          '',
          'error'
        );
      });
  };
  return (
    <>
      <div className="container">
        <h1 className="mt-5 text-center">Leonardo Image Generator</h1>
        <div className="row justify-content-center mt-5">
          <div className="col-md-6">
            <form id="download-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="id">User ID:</label>
                <input
                  type="text"
                  className="form-control mt-1"
                  id="id"
                  name="id"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </div>
              <br />
              <div className="form-group">
                <label htmlFor="token">Token:</label>
                <input
                  type="text"
                  className="form-control mt-1"
                  id="token"
                  name="token"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                />
              </div>
              <br />
              <div className="text-center">
                <button type="submit" className="btn btn-success" disabled={btnEnabledDisabled}>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
