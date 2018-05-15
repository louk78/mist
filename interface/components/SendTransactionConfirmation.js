import React, { Component } from 'react';
import { connect } from 'react-redux';

class SendTransactionConfirmation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toIsContract: false
    };
  }

  componentDidMount() {
    // Determine if "to" is a contract
    web3.eth.getCode(this.props.newTransaction.to, (e, res) => {
      if (!e && res && res.length > 2) {
        this.setState({ toIsContract: true });
        // setWindowSize(template);
      }
    });
  }

  renderTitle() {
    if (this.state.toIsContract) {
      return (
        <h1>
          {i18n.t(
            'mist.popupWindows.sendTransactionConfirmation.title.contractExecution'
          )}
        </h1>
      );
    } else if (this.props.newTransaction && this.props.newTransaction.to) {
      return (
        <h1>
          {i18n.t(
            'mist.popupWindows.sendTransactionConfirmation.title.sendTransaction'
          )}
        </h1>
      );
    } else {
      return (
        <h1>
          {i18n.t(
            'mist.popupWindows.sendTransactionConfirmation.title.createContract'
          )}
        </h1>
      );
    }
  }

  render() {
    return (
      <div className="popup-windows tx-info">
        {this.renderTitle()}

        <div className="transaction-parties">
          <div>
            {this.state.fromIsContract ? (
              <i className="overlap-icon icon-doc" />
            ) : (
              <i className="overlap-icon icon-key" />
            )}
          </div>
        </div>

        {/* <form action="#">

              <div class="container">
              <div class="inner-container">
                  <div class="transaction-parties">
                  <div>
                      {{#if TemplateVar.get "fromIsContract"}}
                          <i class="overlap-icon icon-doc"></i>
                      {{else}}
                          <i class="overlap-icon icon-key"></i>
                      {{/if}}
                      {{> dapp_identicon identity=from class="dapp-large"}}
                      <br>
                      <span class="simptip-position-bottom simptip-movable" data-tooltip="{{from}}">{{shortenAddress from}}</span>
                  </div>
                  <div class="connection">
                      <div class="amount">
                          {{{totalAmount}}} <span class="unit">ETHER</span>
                      </div>
                      {{#if TemplateVar.get "executionFunction" }}
                          <div class='function-signature {{#if TemplateVar.get "hasSignature"}} has-signature {{/if}} '>
                                  {{TemplateVar.get "executionFunction"}}
                          </div>
                      {{/if}}
                  </div>

                  <div>
                      {{#if to}}
                          {{#if TemplateVar.get "toIsContract"}}
                              <i class="overlap-icon icon-doc"></i>
                          {{else}}
                              <i class="overlap-icon icon-key"></i>
                          {{/if}}
                          {{> dapp_identicon identity=to class="dapp-large"}}
                          <br>
                          <a href="http://etherscan.io/address/{{to}}#code" class="simptip-position-bottom simptip-movable" data-tooltip="{{to}}" target="_blank">{{shortenAddress to}}</a>
                      {{else}}
                          <i class="circle-icon icon-doc"></i>
                          <br>
                          <span>{{i18n "mist.popupWindows.sendTransactionConfirmation.createContract"}}</span>
                      {{/if}}
                  </div>
              </div>

              {{#if transactionInvalid}}
                  {{#if (TemplateVar.get "gasLoading") }}
                      <p class="info gas-loading"> 
                          {{> spinner}}
                      </p>
                  {{ else }}
                      <p class="info dapp-error"> 
                          {{i18n "mist.popupWindows.sendTransactionConfirmation.estimatedGasError"}}
                      </p>
                  {{/if}}
              {{else}}
                  {{#unless $eq (TemplateVar.get "gasError") "notEnoughGas"}}
                      {{#if $eq (TemplateVar.get "gasError") "overBlockGasLimit"}}
                          <div class="info dapp-error">
                              {{i18n "mist.popupWindows.sendTransactionConfirmation.overBlockGasLimit"}}
                          </div>
                      {{else}}
                          {{#if $and data (TemplateVar.get "toIsContract")}}
                              <p class="info">
                              {{i18n "mist.popupWindows.sendTransactionConfirmation.contractExecutionInfo"}}
                              </p>
                          {{/if}}

                          {{#unless to}}
                              <p class="info">
                              {{i18n "mist.popupWindows.sendTransactionConfirmation.contractCreationInfo"}}
                              </p>
                          {{/unless}}

                      {{/if}}
                  {{else}}
                      <div class="info dapp-error not-enough-gas" style="cursor: pointer;">
                          {{{i18n "mist.popupWindows.sendTransactionConfirmation.notEnoughGas"}}}
                      </div>
                  {{/unless}}

              {{/if}}

              <div class="fees">
                  <ul>
                      <li>
                          <div class="value">
                          {{i18n "mist.popupWindows.sendTransactionConfirmation.estimatedFee"}}
                          </div>
                          <div class="type">
                              {{#if $eq (TemplateVar.get "estimatedGas") "invalid"}}
                                  <span class="red"><i class="icon-shield"></i> {{i18n "mist.popupWindows.sendTransactionConfirmation.transactionThrow"}}</span>
                              {{else}}

                                  {{#if $eq (dapp_formatNumber (TemplateVar.get "estimatedGas") "0") "0"}}
                                      {{#if (TemplateVar.get "gasLoading") }}
                                          {{i18n "mist.popupWindows.sendTransactionConfirmation.gasLoading"}}
                                          {{> spinner}}
                                      {{else}}
                                          <span class="red"><i class="icon-shield"></i> {{i18n "mist.popupWindows.sendTransactionConfirmation.noEstimate"}}</span>
                                      {{/if}}
                                  {{else}}
                                      {{estimatedFee}} ({{dapp_formatNumber (TemplateVar.get "estimatedGas") "0,0"}} gas)
                                  {{/if}}



                              {{/if}}
                          </div>
                      </li>
                      <li>
                          <div class="value">
                              {{i18n "mist.popupWindows.sendTransactionConfirmation.gasLimit"}}
                          </div>
                          <div class="type">
                              {{providedGas}} ether (<span class="provided-gas" contenteditable="true">{{dapp_formatNumber (TemplateVar.get 'initialProvidedGas') '0'}}</span> gas)
                          </div>
                      </li>
                      <li>
                          <div class="value">
                              {{i18n "mist.popupWindows.sendTransactionConfirmation.gasPrice"}}
                          </div>
                          <div class="type">{{dapp_formatBalance gasPrice "0,0.0[0000]" "szabo"}} {{i18n "mist.popupWindows.sendTransactionConfirmation.perMillionGas"}}</div>
                      </li>
                  </ul>
              </div>

              {{#if data}}
                  {{#if showFormattedParams}}
                      <div class="parameters">
                          <h3>{{i18n "mist.popupWindows.sendTransactionConfirmation.parameters"}}
                              <a href="#" class="toggle-panel">{{i18n "mist.popupWindows.sendTransactionConfirmation.showRawBytecode"}}</a>
                          </h3>
                          <ol>
                          {{# each param in params}}
                              <li>{{> dapp_output output=param }}</li>
                          {{/each}}
                          </ol>
                      </div>
                  {{else}}
                      <div class="data">
                          <h3>{{i18n "mist.popupWindows.sendTransactionConfirmation.data"}}

                          {{# if params}}
                              <a href="#" class="toggle-panel">{{i18n "mist.popupWindows.sendTransactionConfirmation.showDecodedParameters"}}</a>
                          {{else}}
                              {{#if to}}
                                  {{#unless (TemplateVar.get "lookingUpFunctionSignature")}}
                                      <a class="lookup-function-signature simptip-position-bottom simptip-movable" data-tooltip="{{i18n 'mist.popupWindows.sendTransactionConfirmation.lookupDataExplainer'}}"> {{i18n "mist.popupWindows.sendTransactionConfirmation.lookupData"}}
                                      </a>
                                  {{/unless}}
                              {{/if}}
                          {{/if}}
                          </h3>

                          <pre>{{{formattedData}}}</pre>
                      </div>
                  {{/if}}
              {{/if}}

              </div>
              </div>
              <footer>
              {{#if TemplateVar.get "unlocking"}}
                  <h2>{{i18n "mist.popupWindows.sendTransactionConfirmation.unlocking"}}</h2>
              {{else}}
                  <input type="password" placeholder="{{i18n 'mist.popupWindows.sendTransactionConfirmation.enterPassword'}}">

                  {{#if $neq (TemplateVar.get "network") "main"}}
                      <div class="network">
                          {{TemplateVar.get "network"}}
                      </div>
                  {{/if}}

                  <div class="dapp-modal-buttons">
                      <button class="cancel" type="button">{{i18n "buttons.cancel"}}</button>
                      <button class="ok dapp-primary-button" type="submit">{{i18n "mist.popupWindows.sendTransactionConfirmation.buttons.sendTransaction"}}</button>
                  </div>
              {{/if}}
              </footer>

        </form>
 */}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(SendTransactionConfirmation);
