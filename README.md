# Outpost Explorers

An interactive learning website about the Moon, Mars and the missions exploring them. The public site is published automatically from this repository using GitHub Pages.

## Explore

- Click **Let’s explore** to enter the 3D expedition.
- Choose the Moon or Mars, scan from orbit, visit an illustrative outpost, drive a rover and solve science challenges.
- Browse the mission atlas for milestones, discoveries, future plans and official agency sources.
- Try the quiz and save discoveries in your browser.

## Run on your computer

With Python installed, open a terminal in this repository and run:

```sh
python -m http.server 8080
```

Then visit http://localhost:8080. The site uses JavaScript modules, so opening `index.html` directly as a file will not work correctly.

## Updating

The files served at the website root are the complete site. Edit them, then commit and push to `main`; GitHub Actions will publish the update. The mission catalogue is a reviewed educational snapshot, not a live or exhaustive mission tracker. Future dates are targets and may change. All 3D terrain and mission procedures are illustrative learning models.

NASA imagery credits appear on the site. No affiliation with or endorsement by NASA or any other space agency is claimed. The outpost is a future concept; there are no inhabited outposts on the Moon or Mars today.

The 3D orbital Moon uses NASA Scientific Visualization Studio's CGI Moon Kit textures: the LROC wide-angle camera global colour mosaic and LOLA elevation data. Source: https://svs.gsfc.nasa.gov/4720/
