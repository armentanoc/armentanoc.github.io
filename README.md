# 📊 GitLab Contributions Chart 📆
## Overview
This project generates a visual contribution chart based on JSON data, typically used to display contributions for GitLab or similar platforms. The chart is represented as an SVG image that can be downloaded and used for various purposes.

## Features
- Upload JSON File: Upload a JSON file containing contribution data.
- Generate SVG Chart: Automatically generate a visual representation of contributions.
- Download SVG: Download the generated chart as an SVG file.
- Error Handling: Display relevant error messages if issues arise.

## GitLab Information
You can collect your contribution data in JSON format from the following URL:
```bash
https://gitlab.{{your_company_url}}/users/{{your_username}}/calendar.json
```

For example: 
```
https://gitlab.miisy.me/users/carolina.armentano/calendar.json
```

It should be something like this:
```json 
{
    "2024-01-01": 3,
    "2024-01-02": 7,
    "2024-01-03": 1,
    ...
}
```

## Deployment
Then, you can visit the deployed website on: 

```bash
https://gitlab-chartbuilder.vercel.app/
```

Upload your JSON file and Download your SVG with your contribution chart :) 

## Contributing
If you'd like to contribute to this project, please fork the repository and submit a pull request with your changes. 

## Contact
- GitHub: armentanoc
- LinkedIn: armentanocarolina
- Email: armentanocarolina@gmail.com
