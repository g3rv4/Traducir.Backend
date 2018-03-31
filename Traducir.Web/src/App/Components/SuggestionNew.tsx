import * as React from "react";
import axios, { AxiosError } from 'axios';
import UserInfo, { UserType } from "../../Models/UserInfo";
import { StringSuggestionState } from "../../Models/SOStringSuggestion";

export interface SuggestionNewProps {
    user: UserInfo;
    stringId: number;
    goBackToResults: (stringIdToUpdate?: number) => void;
}

interface SuggestionNewState {
    suggestion: string;
}

export default class SuggestionNew extends React.Component<SuggestionNewProps, SuggestionNewState> {
    constructor(props: SuggestionNewProps) {
        super(props);

        this.state = {
            suggestion: ''
        };
    }

    postSuggestion = (approve: boolean) => {
        axios.put('app/api/suggestions', {
            StringId: this.props.stringId,
            Suggestion: this.state.suggestion,
            Approve: approve
        }).then(r => this.props.goBackToResults(this.props.stringId))
            .catch(e => alert('Failed sending the suggestion. Are you missing a variable?'));
    }

    render(): JSX.Element {
        if (!this.props.user || !this.props.user.canSuggest) {
            return null;
        }
        return <form>
            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="suggestion" className="font-weight-bold">New Suggestion</label>
                        <textarea className="form-control" id="suggestion"
                            value={this.state.suggestion}
                            onChange={e => this.setState({ suggestion: e.target.value })} />
                    </div>
                </div>
            </div>
            <div>
                <div className="mt-1">
                    <div className="btn-group" role="group">
                        <button type="button" className="btn btn-primary float-left"
                            onClick={e => this.postSuggestion(false)}>Send new suggestion</button>
                        {this.props.user.userType >= UserType.Reviewer ?
                            <button type="button" className="btn btn-warning float-left"
                                onClick={e => this.postSuggestion(true)}>Send final translation</button>
                            : null}
                    </div>
                    <button type="button" className="btn btn-secondary float-right"
                        onClick={e => this.props.goBackToResults(null)}>Go back</button>
                </div>
            </div>
        </form>
    }
}