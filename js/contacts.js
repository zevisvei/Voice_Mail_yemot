function getcontactsList(pageToken = "", dict_all = {}){
  let contactsList = People.People.Connections.list('people/me', {
      personFields: 'names,emailAddresses,phoneNumbers,memberships', pageSize: 1000, pageToken: pageToken
    });
  let blacklistId = log.blackListId
  let name
  let email
  let blacklist
  for (var i = 0; i < contactsList.connections.length; i++) {
    name = null
    email = null
    blacklist = false
    if (contactsList.connections[i].names && contactsList.connections[i].names.length > 0) {
      name = contactsList.connections[i].names[0].displayName
    }
    let memberships = contactsList.connections[i].memberships
    if (memberships.some(membership => membership.contactGroupMembership.contactGroupResourceName === blacklistId)) {
      blacklist = true
    }

    let emails = contactsList.connections[i].emailAddresses
    if(emails){
      for(var m=0; m < emails.length; m++){
        if(emails[m].metadata.primary){
          email = emails[m].value
          break;
      }
    }}

    let phoneNumbers = contactsList.connections[i].phoneNumbers
    if(phoneNumbers){
      for(var f=0; f < phoneNumbers.length; f++){
        let number = phoneNumbers[f].canonicalForm
        if(number){
          dict_all[number] = {"name": name, "email": email, "blacklist": blacklist}
          }
      }
    }
  }
  if(contactsList.nextPageToken){
    getcontactsList(contactsList.nextPageToken, dict_all)
  }
  return dict_all
}

function CreateBlackListGroup() {
  let blacklistId = null
  let labeles = People.ContactGroups.list()
  if (labeles.contactGroups) {
    labeles.contactGroups.forEach(group => {
    if (group.name === "רשימה שחורה"){
      blacklistId = group.resourceName
    }
    });
  }
  if(!blacklistId){
    const r = People.ContactGroups.create({
      contactGroup: {
        name: "רשימה שחורה"
      }
    })
    blacklistId = r.resourceName
  }
  logSheet.getRange("B6").setValue(blacklistId)
  log["blacklistId"] = blacklistId
}

