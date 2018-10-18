import React from 'react';
import StorageHandler from '../StorageHandler';
import Accordion from './Accordion';
import ListIngredient from './ListIngredient';
import Modal from '../Modal/Modal';
import Message from '../Message/Message';
import MessageService from '../Message/MessageService';
import { MessageContext, messagesContext } from '../Message/messages-context';

import './ListRecipe.css';
import './Accordion.css';

const storageHandler = new StorageHandler('recipe');
const messageService = new MessageService();

export default class ListRecipe extends React.Component {
  /**
   * ListRecipe constructor.
   *
   * @public
   */
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      message: {
        status: '',
        text: ''
      },
      recipes: []
    };
  }

  /**
   * Get recipes and set them to state.
   *
   * @public
   */
  componentDidMount = () => {
    this.updateStateWithRecipes();
    this.setState({ message: messagesContext.message });
  };

  /**
   * Handle componentWillUnmount actions.
   *
   * @public
   */
  componentWillUnmount = async () => {
    await messagesContext.clearMessages();
    console.log('componentWillUnmount');
  };

  showModal = () => {
    this.setState({ showModal: true });
  };

  hideModal = () => {
    this.setState({ showModal: false });
  };

  /**
   * Update state with new recipes.
   *
   * @public
   */
  updateStateWithRecipes = () => {
    storageHandler.getRecipes().then(res => {
      this.setState({ recipes: res });
    });
  };

  /**
   * Handle delete of a recipe.
   *
   * @param {Object} recipe
   * @public
   */
  handleDeleteRecipe = recipe => {
    storageHandler.deleteRecipeById(recipe.id).then(res => {
      let status = messagesContext.message.status;
      let text = messagesContext.message.text;

      if (res) {
        status = messageService.getRecipeDeleteStatus();
        text = messageService.getRecipeDeleteMessage(recipe.name);
      } else {
        status = messageService.getRecipeDeleteFailStatus();
        text = messageService.getRecipeDeleteFailMessage(recipe.name);
      }

      messagesContext.setMessage(status, text);

      this.setState({ message: messagesContext.message });
      this.setState({ showModal: false });
      this.updateStateWithRecipes();
    });
  };

  /**
   * Render the form.
   *
   * @public
   */
  render() {
    return (
      <div>
        <MessageContext.Provider value={this.state.message}>
          <Message message={this.state.message} />
        </MessageContext.Provider>

        <h2 className="ListRecipe-title">Recipes</h2>

        <ul className="ListRecipe-container">
          <Accordion allowMultipleOpen>
            {this.state.recipes.map((recipe, index) => (
              <div
                key={index}
                label={recipe.name}
                description={recipe.description}
              >
                <ul>
                  <h4>Ingredients</h4>
                  {recipe.ingredients.map((ingredient, index) => (
                    <ListIngredient key={index} ingredient={ingredient} />
                  ))}
                </ul>
                <div>
                  <a href={'recipe/edit/' + recipe.id}>
                    <button className="btn btn_tertiary">Edit recipe</button>
                  </a>

                  <button
                    type="button"
                    className="btn btn_secondary"
                    name="deleteRecipeModalButton"
                    onClick={() => this.showModal()}
                  >
                    Delete recipe
                  </button>
                  <Modal
                    show={this.state.showModal}
                    handleClose={this.hideModal}
                  >
                    <div className="ListRecipe-deleteModal">
                      <h3>Are you sure you would like delete this recipe?</h3>
                      <div className="ListRecipe-buttonGroup">
                        <button
                          type="button"
                          className="btn btn_secondary"
                          name="deleteRecipeModalButton"
                          onClick={() => this.handleDeleteRecipe(recipe)}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className="btn btn_primary"
                          name="deleteRecipeModalButton"
                          onClick={() => this.hideModal()}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </Modal>
                </div>
              </div>
            ))}
          </Accordion>
        </ul>
      </div>
    );
  }
}
