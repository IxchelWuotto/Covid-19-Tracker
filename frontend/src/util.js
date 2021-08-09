export const sortData = (data) => {
    const sortedData = [...data];


    return sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));
    /*{
        console.log(a.case);
        if (a.cases > b.cases) {
            return -1; //false
        } else {
            return 1; //true
        }
    }); 
    return sortedData;*/
};