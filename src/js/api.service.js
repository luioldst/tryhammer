import axios from 'axios';
export const API_SERVICE =  {
    computed: {
        $http () {
            return axios.create({
                baseURL: `https://9jixdsivsd.execute-api.us-east-1.amazonaws.com/prod`,
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'x-api-key': 'iIKO7pjo5B8AHvYICZMXQ1tmvbvBa3FY8wjCa6w8'
                }
            });
        }
    }
}