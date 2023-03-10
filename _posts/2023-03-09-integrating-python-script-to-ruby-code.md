---
layout: post
title: Integrating python script to ruby code
date: 2023-03-09
author: parashagrawal1
tags: post
tag: backend
permalink: posts/2023-03-09-integrating-python-script-to-ruby-code/
fullname: Parash Agrawal
---

# Introduction


Ruby is a dynamic and open source language capable of carrying out large
varieties of tasks and functionalities. But, there are few things that are
limited to a specific language. There are scenarios where carrying out tasks in
other programming language has more incentives. These incentives may be speed,
convenience, better support, large community and many more.


In this blog, we are going to discuss about a problem that is not generic but
may be the only way out when in need. We are going to take a look at how to make
a ruby script communicate with a python script and fetch response. It is going
to be similar to sending a request into an endpoint and receiving response from
it.


A gem [Open3](https://rubygems.org/gems/open3) gives us ability to access stdin,
stdout, and stderr when running other programs. We can install the gem simply by
`gem install open3`.


## Ruby code


1. Lets create a ruby file named `hello-ruby.rb`

2. Firstly, require `open3` in the file by simply writing `require 'open3'`

3. Then, we can use the `Open3.capture3` method
  - `Open3.capture3` gives a string for stdin; get strings for stdout, stderr
  - We should pass the path to python
    - Example: `/usr/bin/python` for ubuntu
  - Then, the second argument should be the path to the python script
  - There are no more mandatory arguments to be passed. But we can pass as much arguments as we require. These are received in the python file.
  - Only strings can be passed as arguments.
4. The `Open3.capture3` will return stdout, stderr and status from the call

5. The final ruby code should look like:


```
  stdout, stderr, status = Open3.capture3(
    '/opt/venv/bin/python',
    './hello-python-script.py',
    'this is a string_parameter required in the python file',
    'in_case, we_require_an_array_to_be_passed, convert_it_to, comma_separated, string_format',
    '244'
  )
```


## Python code


Now, lets create a python file to receive the call and then respond as per
required.

1. Create a python file named `hello-python-script.py`

2. Import sys in the file like `import sys`

3. Now, we can receive the arguments passed from the Open3 call using `sys.argv`
  - To get 'this is a string_parameter required in the python file', use `sys.argv[1]` since it will receive './hello-python-script.py' in the first index
  - Similarly, we can get the comma separated string using `sys.argv[2]` and break it into required format
  - In the same way, we receive '244' in `sys.argv[3]`
4. Do the required stuffs in python code

5. Now, we can simply send a response using `sys.stdout.write("some-string")`

6. We can respond json data like `json.dumps(array_data)`

7. The final code should look like:

    ```
    import sys
    
    sentence_arg = sys.argv[1]
    comman_separated_arg = sys.argv[2]
    number_arg = sys.argv[3]
    
    sys.stdout.write(number_arg)
    ```

## Notes


- The reponse `number_arg` is recevied as `stdout` value in ruby code

- In case of error, the full error message is recevied as `stderr`

- `status` receives the status from the call. In case of successful call, we can
check using `status.success`

- Simply run `ruby hello-ruby.rb` in command line


### Example:


The following code receives data from dummyjson. We pass arguments from the ruby
code into python script and return response. Product list is printed in the
console if the response is successful, else print error message.


```

// main.rb


require 'open3'

require 'json'


search_keyword = 'Laptop'

results_limit = 3


stdout, stderr, status = Open3.capture3(
  '/usr/bin/python3',
  './fetch-dummy-json.py',
  search_keyword,
  results_limit.to_s
)


if status.success?
  puts JSON.parse(stdout)
else
  puts stderr
end

```


```

// fetch-dummy-json.py


import json

import requests

import sys


search_keyword = sys.argv[1]

results_limit = sys.argv[2]


payload={}

headers = {}

url = "https://dummyjson.com/products/search?q=" + search_keyword + "&limit=" +
results_limit


response = requests.request("GET", url, headers=headers, data=payload)


sys.stdout.write(json.dumps(response.text))

```

