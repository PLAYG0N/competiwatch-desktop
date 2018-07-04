import React, { Component } from 'react'
import MatchForm from './MatchForm'
import MatchesAccountHeader from './MatchesAccountHeader'
import Match from '../models/Match'
import Account from '../models/Account'

class MatchesPage extends Component {
  constructor(props) {
    super(props)
    this.state = { totalMatches: 0 }
  }

  componentDidMount() {
    const { dbAccounts, accountID } = this.props
    Account.find(dbAccounts, accountID).then(account => {
      this.setState(prevState => ({ account }))
    })
  }

  onMatchCreation = () => {
    this.setState(prevState => ({ totalMatches: prevState.totalMatches + 1 }))
  }

  onMatchesLoad = totalMatches => {
    this.setState(prevState => ({ totalMatches }))
  }

  render() {
    const { dbMatches } = this.props
    const { totalMatches, account } = this.state

    return (
      <div className="container layout-children-container">
        <MatchesAccountHeader
          account={account}
        />
        <MatchForm
          db={dbMatches}
          onCreate={this.onMatchCreation}
        />
      </div>
    )
  }
}

export default MatchesPage
