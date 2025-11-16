import PocketBase from 'https://unpkg.com/pocketbase/dist/pocketbase.es.mjs';

const pb = new PocketBase('http://127.0.0.1:8090');

export async function clearCollection(){
    try{
        const records = await pb.collection('punti').getFullList()
        for(const record of records){
            await pb.collection('punti').delete(record.id)
        }
    location.reload();
    }

    catch(err){
        console.warn(err)
    }
}
