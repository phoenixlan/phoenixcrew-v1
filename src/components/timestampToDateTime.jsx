const localeStringSettings = {
    DD_MM_YYYY_HH_MM:       {hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit'},
    DD_MM_YYYY_HH_MM_SS:    {hour: '2-digit', minute: '2-digit', second: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit'},
    DD_MONTH_YYYY_HH_MM_SS: {hour: '2-digit', minute: '2-digit', second: '2-digit', year: 'numeric', month: 'long', day: '2-digit'},
    
    DD_MM_YYYY:             {year: 'numeric', month: '2-digit', day: '2-digit'},
    DD_MONTH_YYYY:          {year: 'numeric', month: 'long', day: '2-digit'},

    HH_MM_SS:               {hour: '2-digit', minute: '2-digit', second: '2-digit'},
}

export const TimestampToDateTime = ({timestamp, type}) => {
    if(type) {
        if(!localeStringSettings[type]) {
            throw "Invalid locale string layout"
        }
    }

    let dateTime = new Date(timestamp*1000).toLocaleString('no-NO', localeStringSettings[type] || localeStringSettings["DD_MM_YYYY_HH_MM_SS"])

    return dateTime
}