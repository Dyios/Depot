function NumberToCurrency(number){
    
    const options ={
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }
    const formatter = new Intl.NumberFormat('fr-FR',options)

    number = typeof(number) == 'string' ?  number.replace(',','.') : number
    
    return isNaN(number) ? '' : formatter.format(number)
}

export default NumberToCurrency;