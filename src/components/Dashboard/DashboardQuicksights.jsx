import React, { useEffect, useState } from 'react'
import { embedDashboard } from 'amazon-quicksight-embedding-sdk'
import * as AWS from 'aws-sdk'
//import * as QuickSight from 'aws-sdk/clients/quicksight'
import URL from '../../Constants/apiUrls'
import axios from 'axios'

function DashboardQuicksights() {
  AWS.config.update({ region: 'us-west-2' })
  const roleId = localStorage.getItem('roleId')
  const [siteName, setSiteName] = useState('')
  const [initialRender, setInitialRender] = useState(true)
  //const quicksight = new QuickSight({ apiVersion: '2018-04-01' })
  useEffect(() => {
    ;(async () => {
      const site = await localStorage.getItem('siteName')
      setSiteName(site)
      console.log('requesting to server')
      if (initialRender) {
        const response = await axios.get(`${URL.BASE}User/GetQuickSightUrl?userid=2d586569-328e-4822-947c-8b3266eb0d46`, { headers: { role_id: roleId } })
        const embedUrl = response.data.data
        console.log(embedUrl)
        const options = {
          url: embedUrl,
          container: '#embeddingContainer',
          parameters: { country: 'United States' },
          scrolling: 'no',
          locale: 'en-US',
          footerPaddingEnabled: true,
        }
        var dashboard = embedDashboard(options)
        dashboard.on('error', () => console.error('Error has occured !!'))
        dashboard.on('load', () => console.log('success'))
      } else {
        if (siteName !== '') {
          dashboard.setParameters({ SiteName: siteName })
        }
      }
      //dashboard.setParameters({ SiteName: siteName })
    })()
  }, [siteName])

  return <div id='embeddingContainer' style={{ height: '96vh' }}></div>
}

export default DashboardQuicksights
