let fileType = "fileType"
let items = "items"

function get_lest_file() {
    let listfile = JSON.parse(UrlFetchApp.fetch(`${url_yemot_api}GetIvrTree?token=${token}&path=ivr2:/0`));
    console.log(listfile)
    if (listfile.responseStatus === 'OK') {
        let lastfilename = listfile.items
            .filter(file => file.fileType.toUpperCase() === 'AUDIO' || file.fileType.toUpperCase() === 'TTS')
            .map(file => file.name.split('.')[0])
            .find(filename => !isNaN(filename));
        let newnumber = (lastfilename || -1) + 1;
        let newname = newnumber.toString().padStart(3, '0');
        let fileextension = '.tts'
        let filePath = `path=ivr2:/0${newname}${fileextension}`;
        console.log(lastfilename);
        return filePath;
    }
}

function getjsondata_2() {
  const url = `${url_yemot_api}GetIvrTree?token=${token}&path=ivr2:/0`;
  const res = UrlFetchApp.fetch(url);
  const dataastext = res.getContentText();
  const data = JSON.parse(dataastext);
  if (data.items) {
    const items = data.items;
    const results = items.map(post => {
      return [post.exists, post.name, post.date];
    });
    console.log(results)
    return results;
  } else {
    // Handle the case where "items" property is not present
    console.error("No 'items' property found in the JSON data.");
    return [];
  }
}
/*
const maxFileNumber = data.reduce((max, item) => {
  const fileName = item[1];
  const fileNumber = parseInt(fileName.split('.')[0]);
  return Math.max(max, fileNumber);
}, 0);
console.log(getjsondata_2)
*/

function getjsondata() {
  const url = `${url_yemot_api}GetIvrTree?token=${token}&path=ivr2:/0`;
  const res = UrlFetchApp.fetch(url);
  const dataastext = res.getContentText();
  const data = JSON.parse(dataastext);
  if (data.items) {
    const items = data.items;
    const results = items.map(post => {
      return [post.exists, post.name, post.date];
    });
    return results;
  } else {
    // Handle the case where "items" property is not present
    console.error("No 'items' property found in the JSON data.");
    return [];
  }
}


/**
 * Gets a list of people in the user's contacts.
 * @see https://developers.google.com/people/api/rest/v1/people.connections/list
 */
function getConnections() {
  try {
    // Get the list of connections/contacts of user's profile
    const people = People.People.Connections.list('people/me', {
      personFields: 'names,emailAddresses'
    });
    // Print the connections/contacts
    console.log('Connections: %s', JSON.stringify(people, null, 2));
  } catch (err) {
    // TODO (developers) - Handle exception here
    console.log('Failed to get the connection with an error %s', err.message);
  }
}

