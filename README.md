# Project Description  

This version of Marzneshin (similar to Marzban) has been customized for the MoreBot sales bot.  

## Setup Instructions  

After installing the original version of Marzneshin and making any desired changes, to use this version, replace your Marzneshin tag in the configuration:  

From:  
```  
services:  
  marzneshin:  
    image: marzneshin/marzneshin:latest  
```  

To:  
```  
services:  
  marzneshin:  
    image: ghcr.io/erfjab/marzneshin:master  
```  

Then, add these two values to your `.env` file:  

```  
MOREBOT_SECRET=""  # Secret key received from MoreBot (Server Info section)  
MOREBOT_LICENSE="" # License key provided by the admin (@ErfJab)  
```  

Finally, update and restart Marzneshin. Done.