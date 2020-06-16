

export async function deleteBoardById(id: string){
    const url = `${process.env.API_URL}/board/delete/${id}`;
    
    const res = await fetch(url, {
      method: 'delete'
    });
    return res;
}  

