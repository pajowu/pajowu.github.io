var show_contact = false;

function toggleContact() {
	if (show_contact) {
		document.getElementById("contact_data").style.display = "none";
		document.getElementById("contact_icons").style.display = "block";
		document.getElementById("show_contact_data").style.display = "inline-block";
		document.getElementById("hide_contact_data").style.display = "none";
	} else {
		document.getElementById("contact_data").style.display = "block";
		document.getElementById("contact_icons").style.display = "none";
		document.getElementById("show_contact_data").style.display = "none";
		document.getElementById("hide_contact_data").style.display = "inline-block";
	}
	show_contact = !show_contact;
}